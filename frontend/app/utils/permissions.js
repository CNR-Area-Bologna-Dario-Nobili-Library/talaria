export function checkPermissions(user, permissions, resource) {
  if(!resource) {
    return false; //chi ha solo un ruolo (e non ha quindi auth specifiche su risorse, NON deve accedere alle routes)
  }
  //console.log('checkPermissions', user, permissions, resource);
  /*if(checkRole(user, "super-admin")) {
    return true;
  }*/
  permissions = typeof permissions === 'string' ? [permissions] : permissions;
  return permissions.map(i => resource.permissions && resource.permissions.includes(i)).filter(i => i===true).length > 0
}
export function checkRole(auth, roles) {
  //console.log('checkRole', auth.permissions, roles)
  if(auth.user.status !== 1) {
  // if(auth.user.status !== 1 || !auth.permissions.roles) {
    return false;
  }
    if(auth.permissions.roles){
    /*if(auth.permissions.roles.includes("super-admin")) {
      return true;
    }*/
    roles = typeof roles === 'string' ? [roles] : roles
    return roles.map(i => auth.permissions.roles.includes(i)).filter(i => i===true).length > 0
  }
  return false;
}

export function checkRoutePermission(auth, route, resource) {  
  if(!route.roles && !route.permissions)
  {    
    return /*forbiddenroles && */true;
  }

  //if(route.roles && route.permissions)
  //{    
  //  return checkPermissions(auth, route.permissions, resource) && checkRole(auth, route.roles)
  //}
  
  //12/06/2024 fix: permissions and roles are always in OR in route definition (so in routes we can specify roles OR permissions, but not both)!
  return (route.roles && checkRole(auth, route.roles) || (route.permissions && checkPermissions(auth, route.permissions, resource)))

}

//get permissions on resource
export function getAuthResource(auth, resource) {  
  return auth && auth.permissions && auth.permissions.resources && auth.permissions.resources[resource.type] && auth.permissions.resources[resource.type].find(i => i.resource.id == resource.id)
}
