import { COMMON_TYPES_CODES } from '../../../../../app-shared/constantes/Constantes';
import { Icons } from '../../../../../app-shared/constantes/Icons';

export const UserListMetatdata = {
  userListTableMetadata: {
    ref: 'TableUserMangement',
    title: 'administration.users.userList.table.title',
    hasPagination: true,
    hasAdd: false,
    hasFilter: true,
    hasExport: false,
    hasImprime: false,
    columns: [
      {
        label: 'administration.users.userList.table.columns.username',
        key: 'username',
        style: {
          width: '20%',
          padding: '0 5px',
        },
        export: {
          width: '20%',
        },
      },
      {
        label: 'administration.users.userList.table.columns.mail',
        key: 'mail',
        style: {
          width: '20%',
          padding: '0 5px',
        },
        export: {
          width: '20%',
        },
      },
      {
        label: 'administration.users.userList.table.columns.etat',
        key: 'stateFr',
        style: {
          width: '15%',
          padding: '0 5px',
        },
        export: {
          width: '15%',
          alignment: 'center',
        },
      },
      {
        label: '',
        key: 'actions',
        type: COMMON_TYPES_CODES.ACTIONS,
        sortable: false,
        style: {
          'text-align': 'center',
          width: '8%',
          padding: '0 5px',
        },
        btns: [Icons.edit, Icons.delete],
      },
    ],
  },
  filterUserListMetadata: {
    labels: {
      login: 'administration.users.userList.filtre.labels.login',
      username: 'administration.users.userList.filtre.labels.username',
      email: 'administration.users.userList.filtre.labels.email',
      state: 'administration.users.userList.filtre.labels.state',
      desProfesFr: 'administration.users.userList.filtre.labels.desProfesFr',
    },
  },
};

export const UserProfilMetadata = {
  userProfilListTableMetadata: {
    ref: 'TableUserProfil',
    title: 'administration.users.userProfil.table.title',
    hasPagination: true,
    hasAdd: false,
    hasFilter: false,
    hasExport: false,
    columns: [
      {
        label: '',
        key: 'checkingCol',
        type: COMMON_TYPES_CODES.HAS_CHECKBOX,
        style: {
          'text-align': 'center',
          width: '6%',
          padding: '0 5px',
        },
        sortable: false,
      },
      {
        label: 'administration.users.userProfil.table.columns.code',
        key: 'code',
        style: {
          width: '20%',
          padding: '0 5px',
        },
        export: {
          width: '20%',
        },
      },
      {
        label: 'administration.users.userProfil.table.columns.desFr',
        key: { fr: 'desFr', en: 'desEn' },
        style: {
          width: '20%',
          padding: '0 5px',
        },
        export: {
          width: '20%',
        },
      },
    ],
  },
};

export const UserDetailsMetadata = {
  UserDetailInfoMetadata: {
    ref: 'UserDetails',
    title: 'administration.users.userDetails.title',
    columns: [
      {
        label: 'administration.users.userProfil.table.columns.code',
        key: 'code',
      },
      {
        label: 'administration.users.userDetails.content.details.username',
        key: 'username',
      },
      {
        label: 'administration.users.userDetails.content.details.mail',
        key: 'mail',
      },
      {
        label: 'administration.users.userList.filtre.labels.desProfesFr',
        key: 'desProfesFr',
      },
      {
        label: 'administration.users.userDetails.content.details.dateBirth',
        key: 'dateBirth',
      },
      {
        label: 'administration.users.userList.table.columns.etat',
        key: 'isActive',
      },

    ],
  },
};

export const UserAddMetadata = {
  title: 'administration.users.userAdd.add',
  labels: {
    login: 'administration.users.userAdd.form.labels.login',
    username: 'administration.users.userAdd.form.labels.username',
    pwd: 'administration.users.userAdd.form.labels.pwd',
    confirmPwd: 'administration.users.userAdd.form.labels.confirmPwd',
    mail: 'administration.users.userAdd.form.labels.mail',
    cin: 'administration.users.userAdd.form.labels.cin',
    dateBirth: 'administration.users.userAdd.form.labels.dateBirth',
    sex: 'administration.users.userAdd.form.labels.sex',
    profession: 'administration.users.userAdd.form.labels.profession',
    code: 'administration.users.userAdd.form.labels.code',
    dateSuspStart: 'administration.users.userAdd.form.labels.dateSuspStart',
    dateSuspEnd: 'administration.users.userAdd.form.labels.dateSuspEnd',
  },
};

export const UserEditMetadata = {
  title: 'administration.users.userEdit.edit',
  labels: {
    login: 'administration.users.userEdit.form.labels.login',
    username: 'administration.users.userEdit.form.labels.username',
    pwd: 'administration.users.userEdit.form.labels.pwd',
    confirmPwd: 'administration.users.userEdit.form.labels.confirmPwd',
    mail: 'administration.users.userEdit.form.labels.mail',
    cin: 'administration.users.userEdit.form.labels.cin',
    dateBirth: 'administration.users.userEdit.form.labels.dateBirth',
    sex: 'administration.users.userAdd.form.labels.sex',
    profession: 'administration.users.userAdd.form.labels.profession',
    code: 'administration.users.userAdd.form.labels.code',
    dateSuspStart: 'administration.users.userAdd.form.labels.dateSuspStart',
    dateSuspEnd: 'administration.users.userAdd.form.labels.dateSuspEnd',
  },
};

export const SelectUserProfessionFilterMetadata = {
  label: 'administration.users.userAdd.form.labels.profession',
  optionLabel: 'desFr',
  filter: true,
  tooltip: false,
  reset: true,
  value: 'desFr',
  emitedValue: '—',
  muliple: false,
};

export const SelectUserProfilMetadata = {
  label: 'administration.users.userAdd.form.labels.profil',
  optionLabel: 'desFr',
  filter: true,
  tooltip: false,
  disabled: false,
  reset: true,
  value: 'desFr',
  emitedValue: 'id',
  muliple: false,
};

export const SelectUserStateMetadata = {
  label: 'administration.users.userList.filtre.labels.state',
  optionLabel: 'desFr',
  filter: true,
  tooltip: false,
  reset: true,
  value: 'desFr',
  emitedValue: 'desFr',
  muliple: false,
  disabled: false,
};

export const FicheListeAgentMetadata = {
  tableListAgentsMetadata: {
    ref: 'TableGestionAgents',
    title: 'paymentAgency.paymentsAgency.pag.ficheListAg.title',
    hasPagination: false, // true | false, default: true
    hasAdd: false,
    hasFilter: false,
    columns: [
      {
        label: 'administration.users.userList.table.columns.mail',
        key: 'mail',
        style: {
          width: '20%',
          padding: '0 100px',
        },
        export: {
          width: '20%',
        },
      },
      {
        label: 'administration.users.userList.table.columns.nomUser',
        key: 'username',
        style: {
          width: '20%',
          padding: '0 100px',
        },
        export: {
          width: '20%',
        },
      },

      {
        label: 'administration.users.userDetails2.content.details.dateCreate',
        key: 'dateCreate',
        style: {
          width: '20%',
          padding: '0 100px',
        },
        type: COMMON_TYPES_CODES.DATE,
        export: {
          width: '20%',
        },
      },
    ],
  },
};
export const SelectUserProfessionMetadata = {
  label: 'administration.users.userAdd.form.labels.profession',
  optionLabel: 'desFr',
  filter: true,
  tooltip: false,
  reset: true,
  value: 'id',
  emitedValue: '—',
  muliple: false,
};
