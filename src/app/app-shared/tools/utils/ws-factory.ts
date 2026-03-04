// ws-factory.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { saveAs } from 'file-saver';

import { ConstanteWs } from '../../constantes/constante-ws';
import { ResponseObject } from '../../models/ResponseObject';
import { EXPORT_TYPES_CODES, REQUEST_SPE_CASE } from '../../constantes/Constantes';
import { ToastService } from '../../services/toast/toast.service';
import { AppTranslateService } from '../../services/translate/translate.service';
import { RequestObject } from '../../models/RequestObject';
import { SearchObject } from '../../models/SearchObject';
import { COMMON_NOMENCLATURE_URI } from '../../../layouts/private/shared/constantes/common/common-nomenclature.uri';
import { Sort } from '../../models/Sort';
import { getNmCurrentLabel } from './factory';
import { environment } from '../../../../environements/environement';
import { urlJoin } from './urlJoin';
import { isEmptyObject, isEmptyValue } from './functions.utils';
import { withParams } from './url-param';

@Injectable({
  providedIn: 'root'
})
export class WsFactory {
  private readonly http = inject(HttpClient);
  private readonly toast = inject(ToastService);
  private readonly ngxTranslateService = inject(TranslateService);
  private readonly appTranslateService = inject(AppTranslateService);

  /**
   * Obtient l'URL de base
   */
  private getBase(microservice?: string, server?: string): string {
    const baseServer = server || environment.servers?.app || '';
    return microservice ? urlJoin(baseServer) : baseServer;
  }

  /**
   * Obtient l'URI
   */
  private getUri(uri: string): string {
    console.assert(!!uri, 'Erreur: Il faut définir votre uri');
    return uri;
  }

  /**
   * Construit le sous-chemin des paramètres de requête
   */
  private getQueryParamsSubpath(queryParams?: Record<string, any>): string {
    if (!queryParams || isEmptyObject(queryParams)) {
      return '';
    }
    return withParams('', queryParams);
  }

  /**
   * Construit le sous-chemin des paramètres de chemin
   */
  private getPathParamsSubpath(pathParams: string[] = []): string {
    if (!pathParams?.length) {
      return '';
    }
    console.assert(
      Array.isArray(pathParams),
      'Erreur: pathParams doit être un Array'
    );
    return '/' + pathParams.join('/');
  }

  /**
   * Appelle une fonction WS
   */
  callFunction(request: RequestObject): Observable<any> {
    switch (request.speCase) {
      case REQUEST_SPE_CASE.UPLOAD:
        return this.handleUpload(request);

      case REQUEST_SPE_CASE.DOWNLOAD:
      case REQUEST_SPE_CASE.DOWNLOAD_PROGRESS:
        return this.handleDownload(request);

      default:
        return this.handleStandardRequest(request);
    }
  }

  /**
   * Gère les requêtes d'upload
   */
  private handleUpload(request: RequestObject): Observable<HttpEvent<string>> {
    const resource = urlJoin(
      this.getBase(request.microservice, request.server),
      this.getUri(request.uri)
    );

    const formData = this.buildFormData(request);

    const httpRequest = new HttpRequest(request.method, resource, formData, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(httpRequest);
  }

  /**
   * Construit le FormData pour l'upload
   */
  private buildFormData(request: RequestObject): FormData {
    const formData = new FormData();

    // Ajout des fichiers
    if (request.listFiles?.length) {
      request.listFiles.forEach(file => {
        formData.append('filedata', file);
      });
    }

    // Ajout des données du formulaire
    if (request.params?.formData) {
      Object.entries(request.params.formData).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length) {
          value.forEach(item => {
            if (item?.size) {
              formData.append(key, item);
            }
          });
        } else if (value && typeof value === 'object' && 'size' in value) {
          formData.append(key, value as Blob);
        } else {
          formData.append(key, JSON.stringify(value));
        }
      });
    }

    // Ajout des paramètres de requête
    if (request.params?.query) {
      Object.entries(request.params.query).forEach(([key, value]) => {
        if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });
    }

    return formData;
  }

  /**
   * Gère les requêtes de téléchargement
   */
  private handleDownload(request: RequestObject): Observable<any> {
    const resource = this.buildResourceUrl(request);
    const options = this.getRequestOptions(request);

    switch (request.method) {
      case ConstanteWs._CODE_GET:
        return this.http.get(resource, options);
      case ConstanteWs._CODE_POST:
        return this.http.post(resource, request.params?.body, options);
      case ConstanteWs._CODE_PUT:
        return this.http.put(resource, request.params?.body, options);
      case ConstanteWs._CODE_DELETE:
        return this.http.delete(resource, { ...options, body: request.params?.body });
      default:
        throw new Error(`Méthode HTTP non supportée: ${request.method}`);
    }
  }

  /**
   * Gère les requêtes standard
   */
  private handleStandardRequest(request: RequestObject): Observable<any> {
    const resource = this.buildResourceUrl(request);
    const options = this.getRequestOptions(request);

    console.assert(!!request.method, 'Erreur: Il faut définir votre méthode');

    switch (request.method) {
      case ConstanteWs._CODE_GET:
        return this.http.get(resource, options);
      case ConstanteWs._CODE_POST:
        return this.http.post(resource, request.params?.body, options);
      case ConstanteWs._CODE_PUT:
        return this.http.put(resource, request.params?.body, options);
      case ConstanteWs._CODE_DELETE:
        return this.http.delete(resource, { ...options, body: request.params?.body });
      default:
        throw new Error(`Méthode HTTP non supportée: ${request.method}`);
    }
  }

  /**
   * Construit l'URL complète de la ressource
   */
  private buildResourceUrl(request: RequestObject): string {
    const base = this.getBase(request.microservice, request.server);
    const uri = this.getUri(request.uri);
    const path = this.getPathParamsSubpath(request.params?.path);
    const query = this.getQueryParamsSubpath(request.params?.query);

    return urlJoin(base, uri) + path + query;
  }

  /**
   * Obtient les options de requête selon le cas spécial
   */
  private getRequestOptions(request: RequestObject): any {
    switch (request.speCase) {
      case REQUEST_SPE_CASE.DOWNLOAD:
        return { responseType: 'blob' as const };

      case REQUEST_SPE_CASE.DOWNLOAD_PROGRESS:
        return {
          responseType: 'blob' as const,
          observe: 'events' as const,
          reportProgress: true
        };

      default:
        return {};
    }
  }

  /**
   * Appelle le service de date du gateway
   */
  callGatewayDateNowPromise(): Observable<any> {
    const resource = urlJoin(this.getBase('gateway'), 'dateNow');
    return this.http.get<any>(resource).pipe(
      map(response => response?.payload)
    );
  }

  /**
   * Calcule une liste de nomenclature
   */
  calListNm(
    nmType: string,
    searchObject?: SearchObject,
    method: 'POST' | 'GET' = 'POST'
  ): Promise<any[]> {
    // Préparation de l'objet de recherche pour POST
    if (method === ConstanteWs._CODE_POST) {
      searchObject = searchObject || new SearchObject();
      searchObject.sort = searchObject.sort || new Sort(
        getNmCurrentLabel(this.appTranslateService.getDefaultLang(), 'libelle'),
        'asc nulls last'
      );
      searchObject.listCol = searchObject.listCol || ['id', 'code', 'libelleAr', 'libelleFr', 'libelleEn'];
    }

    const request: RequestObject = {
      uri: COMMON_NOMENCLATURE_URI[nmType as keyof typeof COMMON_NOMENCLATURE_URI],
      params: {
       ...(method === ConstanteWs._CODE_POST && searchObject ? { body: searchObject } : {})
      },
      method: method
    };

    return new Promise((resolve, reject) => {
      this.callFunction(request).subscribe({
        next: (response: ResponseObject) => {
          if (response?.code === ConstanteWs._CODE_WS_SUCCESS) {
            const data = method === ConstanteWs._CODE_POST
              ? response.payload?.data || []
              : response.payload || [];
            resolve(data);
          } else {
            console.error(`Erreur WsFactory/calListNm, code: ${response?.code}`);
            this.toast.error();
            reject(response);
          }
        },
        error: (error) => {
          console.error(`Erreur WsFactory/calListNm:`, error);
          this.toast.error();
          reject(error);
        }
      });
    });
  }

  /**
   * Fonction d'export
   */
  exportFunction(request: RequestObject, callLocation: string): void {
    // Configuration du cas spécial
    const exportRequest = { ...request, speCase: REQUEST_SPE_CASE.DOWNLOAD };
    const body = exportRequest.params?.body as any;
    // Transformation des métadonnées
     if (body?.metadata) {
    body.metadata = this.prepareMetadataForExport(body.metadata);
  }


    const getFileName = (fileTitle: string, type: string): string => {
      const extension = Object.values(EXPORT_TYPES_CODES)
        .find(v => v.CODE === type)?.EXTENTION || '';
      return fileTitle + extension;
    };

    this.callFunction(exportRequest).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/octet-stream' });
        const fileName = getFileName(
          body?.metadata?.title || 'export',
          body?.typeExport
        );
        saveAs(blob, fileName);
        this.toast.success('general.success_download');
      },
      error: (error) => {
        console.error(`Erreur dans ${callLocation}:`, error);
        this.toast.error();
      }
    });
  }

  /**
   * Prépare les métadonnées pour l'export
   */
  private prepareMetadataForExport(metadata: any): any {
    return {
      ...metadata,
      title: this.ngxTranslateService.instant(metadata.title),
      columns: metadata.columns
        ?.filter((col: any) => !isEmptyValue(col.export))
        .map((col: any) => ({
          ...col,
          label: this.ngxTranslateService.instant(col.label)
        })) || []
    };
  }
}
