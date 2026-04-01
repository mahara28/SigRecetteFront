import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { COMMON_TYPES_CODES } from '../../../../app-shared/constantes/Constantes';
import { Icons } from '../../../../app-shared/constantes/Icons';

// Validateur personnalisé pour la longueur maximale avec message personnalisé
export function maxLengthWithCustomMessage(maxLength: number, message: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    if (value && value.length > maxLength) {
      return { maxlength: message };
    }
    return null;
  };
}

// Métadonnées pour la liste des notifications
export const NotificationListeMetadata = {
  notificationListTableMetadata: {
    ref: 'TableGestionNotifications',
    title: 'notification.table.title',
    hasPagination: true,
    hasAdd: false,
    hasFilter: true,
    hasExport: true,
    hasImprime: true,
    columns: [
      {
        label: 'notification.table.columns.id',
        key: 'id',
        style: {
          width: '5%',
          padding: '0 5px',
        },
        export: {
          width: '5%',
        },
        sortable: true,
      },
      {
        label: 'notification.table.columns.titre',
        key: 'titre',
        style: {
          width: '15%',
          padding: '0 5px',
        },
        export: {
          width: '15%',
        },
        sortable: true,
      },
      {
        label: 'notification.table.columns.sujet',
        key: 'sujet',
        style: {
          width: '20%',
          padding: '0 5px',
        },
        export: {
          width: '20%',
        },
        sortable: true,
      },
      {
        label: 'notification.table.columns.expediteur',
        key: 'usernameEm',
        style: {
          width: '12%',
          padding: '0 5px',
        },
        export: {
          width: '12%',
        },
        sortable: true,
      },
      {
        label: 'notification.table.columns.destinataire',
        key: 'usernameRec',
        style: {
          width: '12%',
          padding: '0 5px',
        },
        export: {
          width: '12%',
        },
        sortable: true,
      },
      {
        label: 'notification.table.columns.email',
        key: 'email',
        style: {
          width: '12%',
          padding: '0 5px',
        },
        export: {
          width: '12%',
        },
        sortable: true,
      },
      {
        label: 'notification.table.columns.dateEnvoi',
        key: 'dateEnvoi',
        type: COMMON_TYPES_CODES.DATE,
        style: {
          width: '10%',
          padding: '0 5px',
        },
        export: {
          width: '10%',
        },
        sortable: true,
      },
      {
        label: 'notification.table.columns.dateReception',
        key: 'dateReception',
        type: COMMON_TYPES_CODES.DATE,
        style: {
          width: '10%',
          padding: '0 5px',
        },
        export: {
          width: '10%',
        },
        sortable: true,
      },
      {
        label: 'notification.table.columns.statut',
        key: 'lu',
        type: COMMON_TYPES_CODES.ICON,
        style: {
          width: '6%',
          padding: '0 5px',
          'text-align': 'center',
        },
        export: {
          width: '6%',
        },
        sortable: true,
      },
      {
        label: 'notification.table.columns.priorite',
        key: 'priority',

        style: {
          width: '8%',
          padding: '0 5px',
          'text-align': 'center',
        },
        export: {
          width: '8%',
        },
        sortable: true,
      },
      {
        label: '',
        key: 'actions',
        type: COMMON_TYPES_CODES.ACTIONS,
        sortable: false,
        style: {
          'text-align': 'center',
          width: '10%',
          padding: '0 5px',
        },
        btns: [Icons.details, Icons.delete],
      },
    ],
  },
  filtreListNotificationsMetadata: {
    labels: {
      titre: 'notification.filter.titre',
      sujet: 'notification.filter.sujet',
      usernameEm: 'notification.filter.expediteur',
      usernameRec: 'notification.filter.destinataire',
      email: 'notification.filter.email',
      lu: 'notification.filter.statut',
      priority: 'notification.filter.priorite',
      dateEnvoiDebut: 'notification.filter.dateEnvoiDebut',
      dateEnvoiFin: 'notification.filter.dateEnvoiFin',
      dateReceptionDebut: 'notification.filter.dateReceptionDebut',
      dateReceptionFin: 'notification.filter.dateReceptionFin',
    },
    selectOptions: {
      lu: [
        { value: 0, label: 'notification.status.unread' },
        { value: 1, label: 'notification.status.read' }
      ],
      priority: [
        { value: 1, label: 'notification.priority.low' },
        { value: 2, label: 'notification.priority.normal' },
        { value: 3, label: 'notification.priority.high' },
        { value: 4, label: 'notification.priority.urgent' }
      ]
    }
  },
};

// Métadonnées pour les détails d'une notification
export const FicheDetailsNotificationMetadata = {
  detailsNotificationMetadata: {
    ref: 'ficheDetailsNotification',
    title: 'notification.detail.title',
    columns: [
      {
        label: 'notification.detail.id',
        key: 'id',
      },
      {
        label: 'notification.detail.qid',
        key: 'qid',
      },
      {
        label: 'notification.detail.titre',
        key: 'titre',
      },
      {
        label: 'notification.detail.sujet',
        key: 'sujet',

      },
      {
        label: 'notification.detail.expediteur',
        key: {
          fr: 'usernameEm',
          en: 'usernameEm'
        },
      },
      {
        label: 'notification.detail.destinataire',
        key: {
          fr: 'usernameRec',
          en: 'usernameRec'
        },
      },
      {
        label: 'notification.detail.email',
        key: 'email',

      },
      {
        label: 'notification.detail.dateEnvoi',
        key: 'dateEnvoi',
        type: COMMON_TYPES_CODES.DATE,
      },
      {
        label: 'notification.detail.dateReception',
        key: 'dateReception',
        type: COMMON_TYPES_CODES.DATE,
      },
      {
        label: 'notification.detail.statut',
        key: 'lu',

      },
      {
        label: 'notification.detail.priorite',
        key: 'priority',

      },
      {
        label: 'notification.detail.messageParent',
        key: 'idMessageParent',
      },
      {
        label: 'notification.detail.sujetMessageParent',
        key: 'sujetMessageParent',
      },
      {
        label: 'notification.detail.titreMessageParent',
        key: 'titreMessageParent',
      },
    ],
  },
};

// Métadonnées pour les notifications non lues (version carte)
export const FicheCartesNotificationsMetadata = {
  cartesNotificationsMetadata: {
    ref: 'CartesNotifications',
    title: 'notification.cards.title',
    emptyMessage: 'notification.cards.empty',
    cardFields: [
      {
        label: 'notification.card.titre',
        key: 'titre',
        style: 'font-weight: bold; font-size: 16px;',
      },
      {
        label: 'notification.card.sujet',
        key: 'sujet',
        style: 'color: #666; margin-top: 8px;',
        maxLength: 100,
      },
      {
        label: 'notification.card.expediteur',
        key: 'usernameEm',
        prefix: 'notification.card.from',
        style: 'margin-top: 12px;',
      },
      {
        label: 'notification.card.dateEnvoi',
        key: 'dateEnvoi',
        type: COMMON_TYPES_CODES.DATE,
        style: 'font-size: 12px; color: #999;',
      },
      {
        label: 'notification.card.priorite',
        key: 'priority',

        style: 'margin-top: 8px;',
      },
    ],
    actions: [
      {
        icon: Icons.details,
        tooltip: 'notification.action.view',
        color: 'primary',
        action: 'view',
      },
      {

        tooltip: 'notification.action.markAsRead',
        color: 'accent',
        action: 'markAsRead',
        showIf: (notification: any) => notification.lu === 0,
      },
      {
        icon: Icons.delete,
        tooltip: 'notification.action.delete',
        color: 'warn',
        action: 'delete',
        confirm: true,
        confirmMessage: 'notification.action.deleteConfirm',
      },
    ],
  },
};

// Métadonnées pour l'export des notifications
export const FicheExportNotificationsMetadata = {
  exportNotificationsMetadata: {
    fileName: 'notifications_export',
    sheetName: 'Notifications',
    columns: [
      { label: 'ID', key: 'id', width: 10 },
      { label: 'Titre', key: 'titre', width: 30 },
      { label: 'Sujet', key: 'sujet', width: 50 },
      { label: 'Expéditeur', key: 'usernameEm', width: 20 },
      { label: 'Destinataire', key: 'usernameRec', width: 20 },
      { label: 'Email', key: 'email', width: 25 },
      { label: 'Date d\'envoi', key: 'dateEnvoi', width: 20, type: 'date' },
      { label: 'Date de réception', key: 'dateReception', width: 20, type: 'date' },
      { label: 'Statut', key: 'lu', width: 15,
        transform: (value: number) => value === 0 ? 'Non lu' : 'Lu' },
      { label: 'Priorité', key: 'priority', width: 15,
        transform: (value: number) => {
          switch(value) {
            case 1: return 'Basse';
            case 2: return 'Normale';
            case 3: return 'Haute';
            case 4: return 'Urgente';
            default: return 'Non définie';
          }
        }
      },
      { label: 'ID Message Parent', key: 'idMessageParent', width: 15 },
    ],
  },
};

// Métadonnées pour le tableau de bord (stats)
export const FicheDashboardNotificationsMetadata = {
  dashboardStatsMetadata: {
    ref: 'DashboardNotifications',
    stats: [
      {
        label: 'notification.dashboard.total',
        key: 'total',
        icon: 'notifications',
        color: 'primary',
      },
      {
        label: 'notification.dashboard.unread',
        key: 'unread',
        icon: 'mark_email_unread',
        color: 'warn',
      },
      {
        label: 'notification.dashboard.read',
        key: 'read',
        icon: 'mark_email_read',
        color: 'accent',
      },
      {
        label: 'notification.dashboard.highPriority',
        key: 'highPriority',
        icon: 'priority_high',
        color: 'danger',
      },
    ],
    charts: [
      {
        title: 'notification.chart.byPriority',
        type: 'pie',
        dataKey: 'priorityDistribution',
        colors: ['#4caf50', '#ff9800', '#f44336', '#9c27b0'],
        labels: ['Basse', 'Normale', 'Haute', 'Urgente'],
      },
      {
        title: 'notification.chart.byStatus',
        type: 'bar',
        dataKey: 'statusDistribution',
        colors: ['#2196f3', '#ffc107'],
        labels: ['Non lues', 'Lues'],
      },
      {
        title: 'notification.chart.byMonth',
        type: 'line',
        dataKey: 'monthlyDistribution',
        colors: ['#4caf50'],
      },
    ],
  },
};

// Métadonnées pour la recherche avancée
export const FicheRechercheAvanceeNotificationsMetadata = {
  rechercheAvanceeMetadata: {
    ref: 'RechercheAvanceeNotifications',
    title: 'notification.advancedSearch.title',
    fields: [
      {
        label: 'notification.search.titre',
        key: 'titre',
        type: 'text',
        placeholder: 'notification.search.titrePlaceholder',
      },
      {
        label: 'notification.search.sujet',
        key: 'sujet',
        type: 'text',
        placeholder: 'notification.search.sujetPlaceholder',
      },
      {
        label: 'notification.search.expediteur',
        key: 'usernameEm',
        type: 'text',
        placeholder: 'notification.search.expediteurPlaceholder',
      },
      {
        label: 'notification.search.destinataire',
        key: 'usernameRec',
        type: 'text',
        placeholder: 'notification.search.destinatairePlaceholder',
      },
      {
        label: 'notification.search.email',
        key: 'email',
        type: 'email',
        placeholder: 'notification.search.emailPlaceholder',
      },
      {
        label: 'notification.search.statut',
        key: 'lu',
        type: 'select',
        options: [
          { value: '', label: 'notification.search.all' },
          { value: 0, label: 'notification.status.unread' },
          { value: 1, label: 'notification.status.read' }
        ],
      },
      {
        label: 'notification.search.priorite',
        key: 'priority',
        type: 'select',
        options: [
          { value: '', label: 'notification.search.all' },
          { value: 1, label: 'notification.priority.low' },
          { value: 2, label: 'notification.priority.normal' },
          { value: 3, label: 'notification.priority.high' },
          { value: 4, label: 'notification.priority.urgent' }
        ],
      },
      {
        label: 'notification.search.dateEnvoiDebut',
        key: 'dateEnvoiDebut',
        type: 'date',
      },
      {
        label: 'notification.search.dateEnvoiFin',
        key: 'dateEnvoiFin',
        type: 'date',
      },
      {
        label: 'notification.search.dateReceptionDebut',
        key: 'dateReceptionDebut',
        type: 'date',
      },
      {
        label: 'notification.search.dateReceptionFin',
        key: 'dateReceptionFin',
        type: 'date',
      },
      {
        label: 'notification.search.idMessageParent',
        key: 'idMessageParent',
        type: 'number',
        placeholder: 'notification.search.idMessageParentPlaceholder',
      },
    ],
    searchButton: 'notification.search.button',
    resetButton: 'notification.search.reset',
  },
};
