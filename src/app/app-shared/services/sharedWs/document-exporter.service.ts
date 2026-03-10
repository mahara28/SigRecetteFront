// document-exporter.service.ts
import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppTranslateService } from '../translate/translate.service';
import { SharedService } from './shared.service';
import { regex } from '../../constantes';
import { DIRECTION } from '../../constantes/Constantes';
import { extraFonts } from '../../constantes/ExtraFonts';
import { DateFormatheurePipe, DateFormatPipe,  MontantPipe } from '../../pipes';
import { Pipe, PipeTransform } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class DocumentExporterService {
  private readonly dateFormatPipe = inject(DateFormatPipe);
  private readonly dateHeureFormatPipe = inject(DateFormatheurePipe);
  private readonly montantPipe = inject(MontantPipe);
  private readonly ngxTranslateService = inject(TranslateService);
  private readonly appTranslateService = inject(AppTranslateService);
  private readonly sharedService = inject(SharedService);

  private pdfMake: any;

  private get isRtl(): boolean {
    return this.appTranslateService.getCurrentDirection() === DIRECTION.RTL;
  }

  private get currentLang(): string {
    return this.appTranslateService.getCurrentLanguage();
  }

  /**
   * Vérifie si un mot est en arabe et l'inverse si nécessaire
   */
  private isArabicWord(text: string): string {
    if (!text) return '';
    return regex.arabicInput().test(text)
      ? text.split(' ').reverse().join(' ')
      : text;
  }

  /**
   * Charge la bibliothèque PDFMake
   */
  private async loadPdfMaker(): Promise<void> {
    if (this.pdfMake) return;

    try {
      const [pdfMakeModule, pdfFontsModule] = await Promise.all([
        import('pdfmake/build/pdfmake'),
        import('pdfmake/build/vfs_fonts')
      ]);

      this.pdfMake = pdfMakeModule.default;
      this.pdfMake.vfs = {
        //...pdfFontsModule.default.pdfMake.vfs,
        'Tajawal-Regular.ttf': extraFonts.Tajawal,
        'Tajawal-Bold.ttf': extraFonts.TajawalBold,
      };

      this.pdfMake.fonts = {
        Amiri: { normal: 'Amiri-Regular.ttf' },
        Tajawal: {
          normal: 'Tajawal-Regular.ttf',
          bold: 'Tajawal-Bold.ttf'
        },
        Cairo: { normal: 'Cairo-Regular.ttf' },
        Roboto: {
          normal: 'Roboto-Regular.ttf',
          bold: 'Roboto-Medium.ttf',
        }
      };
    } catch (error) {
      console.error('Erreur lors du chargement de pdfmake:', error);
      throw new Error('Impossible de charger le générateur PDF');
    }
  }

  /**
   * Génère l'en-tête du PDF
   */
  private async getPageHeader(orientation: 'portrait' | 'landscape'): Promise<any[]> {
    try {
      const dateNow = await this.sharedService.dateNow();
      const formattedDate = this.dateFormatPipe.transform(dateNow);
      const headerWidth = orientation === 'portrait' ? 550 : 850;
      const headerHeight = orientation === 'portrait' ? 70 : 85;

      return [
        {
          margin: [20, 15, 0, 0],
          image: extraFonts[`${orientation}Header`],
          width: headerWidth,
          height: headerHeight,
          alignment: 'center',
        },
        {
          margin: this.isRtl ? [20, 0, 0, 0] : [0, 0, 20, 0],
          text: `${this.ngxTranslateService.instant('general.tunis_in')} ${formattedDate}`,
          alignment: this.isRtl ? 'left' : 'right',
          fontSize: 15,
        }
      ];
    } catch (error) {
      console.error('Erreur lors de la génération de l\'en-tête:', error);
      return [];
    }
  }

  /**
   * Génère l'en-tête du tableau
   */
  private getTableHeader(metadata: any): any[] {
    if (!metadata?.labels) return [];

    const headers = metadata.labels.map((label: string) => ({
      text: this.isArabicWord(this.ngxTranslateService.instant(label || '')),
      style: 'tableHeader',
    }));

    return this.isRtl ? headers.reverse() : headers;
  }

  /**
   * Génère le contenu du tableau
   */
  private getTableContent(metadata: any, listData: any[]): any[][] {
    if (!metadata?.cols || !listData?.length) return [];

    const content: any[][] = [];

    for (const row of listData) {
      const rowContent: any[] = [];

      for (let i = 0; i < metadata.cols.length; i++) {
        const value = row[metadata.cols[i]];
        const type = metadata.types?.[i] || 'text';
        const alignment = metadata.alignments?.[i] || 'left';

        switch (type) {
          case 'date':
            rowContent.push({
              text: value ? this.dateFormatPipe.transform(value) : '',
              alignment: 'center',
              margin: [0, 5, 0, 0],
            });
            break;
          case 'datetime':
            rowContent.push({
              text: value ? this.dateHeureFormatPipe.transform(value) : '',
              alignment: 'center',
              margin: [0, 5, 0, 0],
            });
            break;
          case 'montant':
            rowContent.push({
              text: value != null ? this.montantPipe.transform(value) : '',
              alignment: this.isRtl ? 'right' : 'left',
              margin: [0, 5, 0, 0],
            });
            break;
          default:
            rowContent.push({
              text: this.isArabicWord(value || ''),
              alignment: alignment,
              margin: [0, 5, 0, 0],
            });
        }
      }

      content.push(this.isRtl ? rowContent.reverse() : rowContent);
    }

    return content;
  }

  /**
   * Génère un PDF générique
   */
  async generatePdf(
    fileName: string = 'testFilePdf',
    listData: any[] = [],
    metadata: any = {},
    orientation: 'portrait' | 'landscape' = 'portrait'
  ): Promise<void> {
    try {
      await this.loadPdfMaker();

      const translatedTitle = this.isArabicWord(this.ngxTranslateService.instant(fileName));
      const widths = this.isRtl && metadata.widths ? [...metadata.widths].reverse() : metadata.widths || [];

      const documentDefinition: any = {
        pageOrientation: orientation,
        pageMargins: [25, 120, 25, 25],
        info: {
          title: translatedTitle,
          author: 'Application',
          subject: fileName
        },
        footer: (currentPage: number, pageCount: number) => ({
          text: `Page ${currentPage} / ${pageCount}`,
          alignment: 'center',
          margin: [0, 10, 0, 0]
        }),
        header: await this.getPageHeader(orientation),
        content: [
          {
            margin: [0, 20, 0, 40],
            text: translatedTitle,
            alignment: 'center',
            fontSize: 23,
            bold: true,
          }
        ],
        defaultStyle: { font: 'Tajawal' }
      };

      // Ajouter le tableau si des données existent
      if (listData.length > 0 && metadata.cols) {
        documentDefinition.content.push({
          table: {
            headerRows: 1,
            widths: widths,
            body: [
              this.getTableHeader(metadata),
              ...this.getTableContent(metadata, listData)
            ]
          },
          layout: {
            fillColor: (rowIndex: number) => rowIndex === 0 ? '#1680b3' : null,
          }
        });

        documentDefinition.styles = {
          tableHeader: {
            bold: true,
            fontSize: 14,
            alignment: 'center',
            fillColor: '#1680b3',
            color: '#FFFFFF',
            margin: [0, 5, 0, 0]
          }
        };
      }

      this.pdfMake.createPdf(documentDefinition).download(`${translatedTitle}.pdf`);

    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      throw new Error('Échec de la génération du PDF');
    }
  }

  /**
   * Génère un PDF de décision de refus
   */
  async generatePdfOnRefusCr(
    fileName: string = 'Décision CR',
    data: any = {},
    orientation: 'portrait' | 'landscape' = 'portrait'
  ): Promise<void> {
    try {
      await this.loadPdfMaker();

      const getTranslatedTxt = (key: string): string => {
        const translation = this.ngxTranslateService.instant(`dcr.dialogCR.PdfOnRefusCr.${key}`);
        return this.isArabicWord(translation);
      };

      const translatedTitle = this.isArabicWord(this.ngxTranslateService.instant(fileName));
      const langSuffix = this.currentLang ?
        this.currentLang.charAt(0).toUpperCase() + this.currentLang.slice(1) :
        'Fr';

      const documentDefinition: any = {
        pageOrientation: orientation,
        pageMargins: [25, 120, 25, 25],
        info: {
          title: translatedTitle,
          author: 'Application'
        },
        footer: (currentPage: number, pageCount: number) => ({
          text: `Page ${currentPage} / ${pageCount}`,
          alignment: 'center'
        }),
        header: await this.getPageHeader(orientation),
        content: [
          {
            margin: [0, 20],
            text: [
              `${data[`mintutDem${langSuffix}`] || ''}\n`,
              `${data[`demandeur${langSuffix}`] || ''}\n`,
            ].filter(Boolean),
            alignment: this.isRtl ? 'left' : 'right',
            fontSize: 15,
          },
          {
            margin: [0, 20, 0, 40],
            text: translatedTitle,
            alignment: 'center',
            fontSize: 23,
            bold: true,
          },
          {
            stack: [
              {
                text: [
                  { text: `${getTranslatedTxt('text1')} : `, fontSize: 14, bold: true },
                  { text: `${getTranslatedTxt('text')} ${data.numReq || ''} ${getTranslatedTxt('text3')} ${this.dateFormatPipe.transform(data.dtSoumission) || ''}`, fontSize: 13 }
                ],
                margin: [0, 10, 0, 10]
              },
              {
                text: [
                  { text: `${getTranslatedTxt('text4')} : `, fontSize: 14, bold: true },
                  { text: getTranslatedTxt('text5'), fontSize: 13 }
                ],
                margin: [0, 10, 0, 10]
              },
              {
                text: `\n\n${getTranslatedTxt('text6')} ${this.dateFormatPipe.transform(data.dtDecesion) || ''} ${getTranslatedTxt('text7')}`,
                fontSize: 13,
                margin: [0, 10, 0, 10]
              },
              '\n',
              {
                ul: [data.textMotif || '-'],
                margin: [20, 0, 0, 10],
                fontSize: 14,
              },
              { text: `\n${getTranslatedTxt('text8')}`, fontSize: 13, margin: [0, 10, 0, 5] },
              { text: `\n${getTranslatedTxt('text9')}`, fontSize: 13, margin: [0, 5, 0, 0] }
            ]
          }
        ],
        defaultStyle: { font: 'Tajawal' }
      };

      this.pdfMake.createPdf(documentDefinition).download(`${translatedTitle}.pdf`);

    } catch (error) {
      console.error('Erreur lors de la génération du PDF de refus:', error);
      throw new Error('Échec de la génération du PDF de refus');
    }
  }

  /**
   * Génère un PDF et l'ouvre dans un nouvel onglet (aperçu)
   */
  async previewPdf(
    fileName: string = 'preview',
    listData: any[] = [],
    metadata: any = {},
    orientation: 'portrait' | 'landscape' = 'portrait'
  ): Promise<void> {
    try {
      await this.loadPdfMaker();

      const translatedTitle = this.isArabicWord(this.ngxTranslateService.instant(fileName));
      const widths = this.isRtl && metadata.widths ? [...metadata.widths].reverse() : metadata.widths || [];

      const documentDefinition: any = {
        pageOrientation: orientation,
        pageMargins: [25, 120, 25, 25],
        info: { title: translatedTitle },
        header: await this.getPageHeader(orientation),
        content: [
          {
            margin: [0, 20, 0, 40],
            text: translatedTitle,
            alignment: 'center',
            fontSize: 23,
            bold: true,
          }
        ],
        defaultStyle: { font: 'Tajawal' }
      };

      if (listData.length > 0 && metadata.cols) {
        documentDefinition.content.push({
          table: {
            headerRows: 1,
            widths: widths,
            body: [
              this.getTableHeader(metadata),
              ...this.getTableContent(metadata, listData)
            ]
          }
        });
      }

      this.pdfMake.createPdf(documentDefinition).open();

    } catch (error) {
      console.error('Erreur lors de l\'aperçu du PDF:', error);
    }
  }
}
