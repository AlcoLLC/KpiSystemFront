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

    const showAssigneeColumn = isSuperior && viewMode === 'team';
    const showAssigneeFilter = isSuperior && viewMode === 'team';

    let canCreate = true;
    let showViewSwitcher = isSuperior;
    let formConfig = {};

    if (isEmployee) {
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
      canEdit: (task) => user.id === task.created_by || user.id === task.assignee || user.role === 'admin',
      canDelete: (task) => user.id === task.created_by || user.id === task.assignee || user.role === 'admin',
      canChangeStatus: (task) => user.id === task.assignee || user.role === 'admin',
      showAssigneeColumn,
      showAssigneeFilter,
      showViewSwitcher,
      formConfig
    };
  }, [user, viewMode]);

  return permissions;
};