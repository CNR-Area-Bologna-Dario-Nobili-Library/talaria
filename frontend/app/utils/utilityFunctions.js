//return CSS class to use to render a "permission/ability"
export const permissionBadgeClass = (p) => {
    let ty="badge-info";

    switch (p) {
      case 'manage': 
      case 'manage-users':ty="badge-danger"; break;          

      case 'borrow':
      case 'ill-borrow': ty="badge-primary"; break;          

      case 'lend': 
      case 'ill-lend': ty="badge-secondary"; break;

      case 'deliver': ty="badge-warning"; break;     
      case 'manage-licenses': ty="badge-dark"; break;       
    }

    return ty;
}
