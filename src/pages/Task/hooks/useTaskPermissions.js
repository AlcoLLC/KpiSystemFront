import { useMemo } from 'react';
import useAuth from '../../../hooks/useAuth';

export const useTaskPermissions = (viewMode) => {
  const { user } = useAuth();

  const permissions = useMemo(() => {
    if (!user) {
      return { canViewPage: false };
    }

    const isEmployee = user.role === 'employee';
    const isSuperior = !isEmployee;
    const isAdmin = user.role === 'admin';

    const isCEO = user.role === 'ceo';
    const isTopManagement = user.role === 'top_management';

    const showAssigneeColumn = isSuperior && viewMode === 'team';
    const showAssigneeFilter = isSuperior && viewMode === 'team';

    let canCreate = true;
    let showViewSwitcher = isSuperior;
    let formConfig = {};

    if (isAdmin) {
      return {
        canViewPage: true,
        userRole: 'admin',
        isEmployee: false,
        isSuperior: true,
        canCreate: true,
        canEdit: () => true, 
        canDelete: () => true, 
        canChangeStatus: () => false, 
        showAssigneeColumn: true, 
        showAssigneeFilter: true, 
        showViewSwitcher: false, 
        formConfig: {
          hideFields: [], 
          defaultValues: {}
        }
      };
    }

    if (isCEO) {
            canCreate = true;
            showViewSwitcher = true;
            formConfig = {
                hideFields: [], 
                defaultValues: {}
            };

            return {
                canViewPage: true,
                userRole: 'ceo',
                isEmployee: false,
                isSuperior: true,
                canCreate,
                canEdit: (task) => isAdmin || (isCEO && task.assignee_obj?.role === 'top_management' && viewMode === 'team'),
                canDelete: (task) => isAdmin || (isCEO && task.assignee_obj?.role === 'top_management' && viewMode === 'team'),
                canChangeStatus: (task) => user.id === task.assignee, 
                showAssigneeColumn: true,
                showAssigneeFilter: true,
                showViewSwitcher,
                formConfig
            };
        }

        if (isTopManagement) {
            if (viewMode === 'my') {
                formConfig = {
                    hideFields: ['assignee', 'status'],
                    defaultValues: { assignee: user.id }
                };
            } else {
                 formConfig = {
                    hideFields: ['status'],
                    defaultValues: {}
                 };
            }
        }

      else if (isEmployee) {
      showViewSwitcher = false;
      formConfig = {
        hideFields: ['assignee', 'status'],
        defaultValues: { assignee: user.id }
      };
    } else if (isSuperior) {
      if (viewMode === 'my') {
        formConfig = {
          hideFields: ['assignee', 'status'],
          defaultValues: { assignee: user.id }
        };
      } else {
        formConfig = {
          hideFields: ['status'],
          defaultValues: {}
        };
      }
    }

    return {
      canViewPage: true,
      userRole: user.role,
      isEmployee,
      isSuperior,
      canCreate,
      canEdit: (task) => user.id === task.created_by || user.id === task.assignee,
      canDelete: (task) => user.id === task.created_by || user.id === task.assignee,
      canChangeStatus: (task) => user.id === task.assignee,
      showAssigneeColumn,
      showAssigneeFilter,
      showViewSwitcher,
      formConfig
    };
  }, [user, viewMode]);

  return permissions;
};