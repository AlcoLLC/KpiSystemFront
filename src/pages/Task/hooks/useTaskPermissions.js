import { useMemo } from 'react';
import useAuth from '../../../hooks/useAuth';

/**
 * İstifadəçinin roluna və seçilmiş görünüş rejiminə əsasən
 * tapşırıqlarla bağlı icazələri və konfiqurasiyanı müəyyən edir.
 * @param {string} viewMode - 'my' (Mənim tapşırıqlarım) və ya 'team' (Əməkdaşların tapşırıqları)
 * @returns {object} Genişləndirilmiş icazələr və konfiqurasiya obyekti.
 */
export const useTaskPermissions = (viewMode) => {
  const { user } = useAuth();

  const permissions = useMemo(() => {
    if (!user) {
      return { canViewPage: false }; // Giriş etməyibsə heç bir şeyə icazə yoxdur
    }

    const isEmployee = user.role === 'employee';
    const isManager = user.role === 'manager';
    const isDepartmentLead = user.role === 'department_lead';
    const isTopManagement = user.role === 'top_management';
    const isAdmin = user.role === 'admin';

    // Rəhbər statuslu istifadəçilər (özlərinə aid olmayan taskları görə bilənlər)
    const isSuperior = isManager || isDepartmentLead || isTopManagement || isAdmin;

    // Mövcud rejimdə özü üçün tapşırıq yaradır?
    const isCreatingForSelf = isEmployee || (isSuperior && viewMode === 'my');

    // Defolt icazələr
    let canCreate = true;
    let showAssigneeColumn = true;
    let showAssigneeFilter = true;
    let showViewSwitcher = isSuperior;
    let formConfig = {};

    if (isEmployee) {
      showAssigneeColumn = false;
      showAssigneeFilter = false;
      showViewSwitcher = false;
      formConfig = {
        hideFields: ['assignee', 'status'],
        defaultValues: {
          assignee: user.id,
        },
      };
    } else if (isSuperior) {
      if (viewMode === 'my') {
        showAssigneeColumn = false;
        showAssigneeFilter = false;
        formConfig = {
          hideFields: ['assignee', 'status'],
          defaultValues: {
            assignee: user.id,
          },
        };
      } else { 
        showAssigneeColumn = true;
        showAssigneeFilter = true;
        formConfig = {
          hideFields: ['status'], 
          defaultValues: {},
        };
      }
    }



    return {
      canViewPage: true,
      userRole: user.role,
      isEmployee,
      isSuperior,
      isCreatingForSelf,
      canCreate,
      canEdit: (task) => user.id === task.created_by || user.id === task.assignee || isAdmin,
      canDelete: (task) => user.id === task.created_by || user.id === task.assignee || isAdmin,
      canChangeStatus: (task) => user.id === task.assignee  || isAdmin,
      showAssigneeColumn,
      showAssigneeFilter,
      showViewSwitcher,
      formConfig, 
    };
  }, [user, viewMode]);

  return permissions;
};