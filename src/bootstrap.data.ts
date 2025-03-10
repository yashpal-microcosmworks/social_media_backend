import { PermissionCategory } from './models/user-entity';
import { ROLE_VALUES } from './models/user-entity/role.entity';

const permissionsData = {
  [PermissionCategory.ADMIN]: [
    {
      name: 'Delete User',
      value: 'DELETE_USER',
      description:
        "User having this authority can delete another user's account",
    },
    {
      name: 'Update User',
      value: 'UPDATE_USER',
      description: "User having this authority can update another user's data",
    },
    {
      name: 'Add Single User',
      value: 'ADD_SINGLE_USER',
      description:
        'User having this authority can add a new user to their enterprise.',
    },
    {
      name: 'Add Bulk User',
      value: 'ADD_BULK_USERS',
      description:
        'User having this authority can add users in bulk via CSV file to their enterprise.',
    },

    {
      name: 'Get All Users List',
      value: 'GET_ALL_USERS_LIST',
      description:
        'User having this authority can retrieve the list of all users in the enterprise.',
    },
    {
      name: 'Get Single User Profile',
      value: 'GET_SINGLE_USER_PROFILE',
      description:
        'User having this authority can view the profile details of a single user in the enterprise.',
    },
  ],
};

export const PermissionsList = Object.entries(permissionsData).flatMap(
  ([category, permissions]) =>
    permissions.map((permission) => ({
      ...permission,
      category: category as PermissionCategory,
    })),
);

export const RolesList = [
  {
    name: 'Admin',
    value: ROLE_VALUES.ADMIN,
    description: 'Admin roles',
    permissionValueList: [
      'DELETE_USER',
      'UPDATE_USER',
      'ADD_SINGLE_USER',
      'ADD_BULK_USERS',
      'GET_ALL_USERS_LIST',
      'GET_SINGLE_USER_PROFILE',
    ],
  },

  {
    name: 'User',
    value: ROLE_VALUES.USER,
    description: 'User roles',
    permissionValueList: [],
  },
];
