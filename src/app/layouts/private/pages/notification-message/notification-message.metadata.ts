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
    title: 'notificationsMessage.notifications.notificationsList.table.title',
    hasPagination: true,
    hasAdd: false,
    hasFilter: true,
    hasExport: false,
    hasImprime: false,
    columns: [

      {
        label: 'notificationsMessage.notifications.notificationsList.table.columns.titre',
        key: 'titre',
        style: {
          width: '10%',
          padding: '0 5px',
        },
        export: {
          width: '15%',
        },
        sortable: true,
      },
      /* {
        label: 'notificationsMessage.notifications.notificationsList.table.columns.sujet',
        key: 'idTypeNotif',
        style: {
          width: '20%',
          padding: '0 5px',
        },
        export: {
          width: '20%',
        },
        sortable: true,
      }, */
      {
        label: 'notificationsMessage.notifications.notificationsList.table.columns.sujet',
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
        label: 'notificationsMessage.notifications.notificationsList.table.columns.usernameEm',
        key: 'usernameEm',
        style: {
          width: '8%',
          padding: '0 5px',
        },
        export: {
          width: '12%',
        },
        sortable: true,
      },
      {
        label: 'notificationsMessage.notifications.notificationsList.table.columns.usernameRec',
        key: 'usernameRec',
        style: {
          width: '8%',
          padding: '0 5px',
        },
        export: {
          width: '12%',
        },
        sortable: true,
      },
      {
        label: 'notificationsMessage.notifications.notificationsList.table.columns.email',
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
        label: 'notificationsMessage.notifications.notificationsList.table.columns.dateEnvoi',
        key: 'dateEnvoi',
        type: COMMON_TYPES_CODES.DATE,
        format: 'yyyy-MM-dd HH:mm:ss',
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
        label: 'notificationsMessage.notifications.notificationsList.table.columns.dateReception',
        key: 'dateReception',
        type: COMMON_TYPES_CODES.DATE,
        format: 'yyyy-MM-dd HH:mm:ss',
        style: {
          width: '10%',
          padding: '0 5px',
        },
        export: {
          width: '10%',
        },
        sortable: true,
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


