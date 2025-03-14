import MyLibraryPage from 'containers/Patron/MyLibraryPage/Loadable';
import MyLibrariesListPage from 'containers/Patron/MyLibrariesListPage/Loadable';
// import ChangePassword from 'containers/User/ChangePassword/Loadable';
import ReferencesPage from 'containers/Patron/ReferencesPage/Loadable';
/*import RequestsPage from 'containers/Patron/RequestsPage/Loadable';*/
import ReferencesListPage from 'containers/Patron/ReferencesListPage/Loadable';
import RequestsListPage from 'containers/Patron/RequestsListPage/Loadable';
import SubRouteSwitch from 'components/SubRouteSwitch';
import Fake from 'components/Fake';
import ReferencesLabels from 'containers/Patron/ReferencesLabels/Loadable';
import ReferencesGroups from 'containers/Patron/ReferencesGroups/Loadable';

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/references', name: `Bibliography`, component: SubRouteSwitch, header: true, roles: ['patron'],
    children: [
      { path: '/new', exact: true, icon: "plus", name: `ReferenceNew`, url: `/references/new`, component: ReferencesPage, sidebar: true, order:1},
      { path: '/labels', icon: "tags", exact: true, name: `Labels`, url: '/references/labels', component: ReferencesLabels, sidebar: true, order:3 },
      { path: '/categories', icon: "folder",exact: true, name: `Categories`, url: '/references/categories', component: ReferencesGroups, sidebar: true , order:4},
      { path: '/', icon: "icon-riferimenti", exact: true, name: `ReferenceList`, url: `/references`, component: ReferencesListPage,sidebar: true, order:2 },      
      { path: '/:id?/:op?', exact: true, name: `ReferenceUpdate`, component: ReferencesPage},      
    ]
  },

//  { path: '/searches', name: `Searches`, component: ChangePassword, header: true, },
  { path: '/requests', name: `Requests`, component: SubRouteSwitch, header: true, roles: ['patron'], 
    children: [
      { path: '/archive', icon: "hdd", exact:true, name: `ArchivedRequests`, component: RequestsListPage,url: `/requests/archive`, sidebar: true, order: 2},
      { path: '/', icon: "share", exact: true, name: `PendingRequests`, component: RequestsListPage,url: `/requests`, sidebar: true, order: 1,},
      /*{ path: '/:id?/:edit?', exact: true, name: `RequestDetail`, component: RequestsPage},*/
    ]
  },
  { path: '/my-libraries', name: `MyLibraries`, component: SubRouteSwitch, header: true, 
    children: [
      { path: '/new/:library_id?', icon: "plus", name: `MyLibraryNew`,  component: MyLibraryPage, url:'/my-libraries/new/:library_id?', sidebar: true, order: 1},      
      { path: '/:page?', exact: true,icon: "landmark", name: `MyLibraries`, url: `/my-libraries`, roles: ['patron'], component: MyLibrariesListPage, sidebar: true,order: 2},
      { path: '/:library_id?/edit/:id?',exact: true,name: `Library`, url:'/my-libraries/:library_id?/edit/:id?',roles: ['patron'], component: MyLibraryPage},
      
    ]
  },
  // { path: '/request-access', name: 'Request access', component: ChangePassword, menu: true },
];

// '/:library_id?/my-libraries'

export default routes;
