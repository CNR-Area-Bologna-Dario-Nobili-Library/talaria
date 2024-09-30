import UsersListPage from 'containers/Admin/UsersListPage/Loadable';
import UserPage from 'containers/Admin/UserPage/Loadable';
import Fake from 'components/Fake';
import LibrariesListPage from 'containers/Admin/LibrariesListPage/Loadable';
import InstitutionsListPage from 'containers/Admin/InstitutionsListPage/Loadable';
import InstitutionTypesListPage from 'containers/Admin/InstitutionTypesListPage/Loadable';
import ProjectPage from 'containers/Admin/ProjectPage/Loadable';
import ProjectsListPage from 'containers/Admin/ProjectsListPage/Loadable';

import AvgTimeStats from 'containers/Stats/AvgWorkingTime/Loadable';
import BorrowingStats from 'containers/Stats/BorrowingRequests/Loadable';

import InstitutionPage from 'containers/Admin/InstitutionPage/Loadable';
import InstitutionTypePage from 'containers/Admin/InstitutionTypePage/Loadable';
import SubRouteSwitch from 'components/SubRouteSwitch';

/*import { matchPath } from "react-router-dom";

// examples/notes about permissions in routes
https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
https://www.codedaily.io/tutorials/Use-matchPath-to-Match-Nested-Route-Paths-in-Parent-Routes-with-React-Router

const matchLibraryIdfromPath = (pathname) => {
  const matchProfile = matchPath(pathname, {
    path: `/admin/libraries/:library_id`,
  });
  return (matchProfile && matchProfile.params) || {};
};


const getLibraryIdfromPath = (url) => {
  let mathedLibParam=matchLibraryIdfromPath(url);
  return mathedLibParam?mathedLibParam.library_id:''
}


PROBLEMA: le route vengono generate nella BasePage prima ancora di selezionare qualcosa, quindi è normale che non abbia il parametro!!!

NOTE: super-admin (role) is allowed by default for any routes
*/

const routes = [
  /*
  NOT FULLY IMPLEMENTED
  
  { path: '/users',  name: `UsersList`, component: SubRouteSwitch, header: true, roles: ['super-admin'],
    children: [
      { path: '/', exact: true, icon: 'fa-solid fa-users',name: `UsersList`, url: `/users/user`, component: UsersListPage, sidebar:true},
      { path: '/user/new', icon: 'plus',name: `UserNew`, component: UserPage,  url: `/users/user/new`, sidebar: true},
      { path: '/user/:id?', name: `UserUpdate`, component: UserPage, },
      { path: '/:page?', exact: true, name: `UsersList`, url: `/users/user`, component: UsersListPage, },
    ]
  },*/      
  { path: '/libraries',  name: `Libraries`, component: SubRouteSwitch, header: true, roles: ['super-admin','manager'],sidebar: true,
    children: [      
      { path: '/', exact: true, icon: 'landmark', name: `Libraries`, url: `/libraries`, component: LibrariesListPage,sidebar:true,order:1},      
      //{ path: '/new', icon: 'plus', name: `LibraryCreateNew`, component: LibraryPage,  url: '/library/new', sidebar: true,order:2},
      //{ path: '/:id/subscriptions', exact: true, name: `Subscription`, component: Fake, sidebar: false},                  
      
      //{path: '/:id?',exact: true,icon: 'landmark',name: `Library`, header: false, component: LibraryPage,  sidebar: false,order:2,level:1},                   
      
      //{path: '/:id?/:op?',exact: true, icon: 'landmark',name: `Library`,component: LibraryPage, sidebar: false,order:2,level:1},      
      
     
      /*
      {path: '/:id?/:op?',exact: true, icon: 'landmark',name: `Library`,component: LibraryPage, sidebar: false,order:2,level:1},      
      { path: '/:page?', exact: true, name: `Libraries`, url: `/libraries`, component: LibrariesListPage,sidebar: false },
      */                        
    ]
  },  
//  { path: '/libraries',exact: true,  name: `Libraries`, component: LibrariesListPage, header: true, roles: ['super-admin','manager'],sidebar: true,},  
  { path: '/institutions',  name: `Institutions`, component: SubRouteSwitch, header: true, roles: ['super-admin','manager'],
    children: [
      { path: '/institution-types', exact: true, icon: 'list-ul',  name: `InstitutionTypes`, url: `/institutions/institution-types`, component: InstitutionTypesListPage,  sidebar: true,order:3},      
      { path: '/institution-types/:id?/:op?', exact: true, name: `InstitutionType`, component: InstitutionTypePage, sidebar: false  },
      { path: '/institution-types/:page?', exact: true,  name: `InstitutionTypes`, url: `/institutions/institution-types`, component: InstitutionTypesListPage,  sidebar: false},
      { path: '/institution-types/new',exact: true, icon: 'plus', name: `InstitutionTypeNew`, url: `/institutions/institution-types/new`, component: InstitutionTypePage,  sidebar: true,order:4 },      

      { path: '/', exact: true, icon: 'building', name: `Institutions`, url: `/institutions`, component: InstitutionsListPage, sidebar:true, order:1},
      { path: '/:id?/:op?', exact:true,name: `Institutions`, component: InstitutionPage, sidebar: false },
      { path: '/:page?', exact: true, name: `Institutions`, url: `/institutions`, component: InstitutionsListPage, },            
      { path: '/new', icon: 'plus', name: `InstitutionNew`, component: InstitutionPage,  url: `/institutions/new`, sidebar: true,order:2},            
    ]
  },

  { path: '/stats',  name: `Statistics`, component: SubRouteSwitch, header: true, roles: ['super-admin','manager'],
  children: [    
    { path: '/', exact: true, icon: 'chart-bar', name: `Statistics`, url: `/stats`, component: Fake, sidebar:true, order:1},    
    // { path: '/libraries', exact: true, icon: 'chart-bar', name: `StatisticsLibraries`, url: `/stats/libraries`, component: Fake, sidebar:true, order:1,level:2},    
    // { path: '/institutions', exact: true, icon: 'chart-bar', name: `StatisticsInstitutions`, url: `/stats/institutions`, component: Fake, sidebar:true, order:1,level:2},
    { path: '/avg-working-time', exact: true, icon: 'chart-bar', name: `StatisticsAVGWorkingTime`, url: `/stats/avg-working-time`, component: AvgTimeStats, sidebar:true, order:1,level:2},
    { path: '/borrowing-requests', exact: true, icon: 'chart-bar', name: `StatisticsBorrowingRequests`, url: `/stats/borrowing-requests`, component: BorrowingStats, sidebar:true, order:1,level:2},
  ]
},
  /*
  NOT IMPLEMENTED

  { path: '/consortiums',  name: `Consortiums`, component: SubRouteSwitch, header: true, roles: ['manager'],
    children: [
      { path: '/', exact: true, icon: 'fa-solid fa-building', name: `Consortiums`, url: `/consortiums`, component: Fake, sidebar:true},
      ]
  },
  { path: '/projects',  name: `Projects`, component: SubRouteSwitch, header: true, roles: ['manager'],
    children: [
      { path: '/', exact: true, icon: 'fa-solid fa-diagram-project',name: `Projects`, url: `/projects`, component: ProjectsListPage,sidebar:true},
      { path: '/project/new', icon: 'plus', name: `ProjectNew`, component: ProjectPage,  url: `/projects/project/new`, sidebar: true},
      { path: '/project/:id?', name: `Projects`, component: ProjectPage, },
      { path: '/:page?', exact: true, name: `Projects`, url: `/projects`, component: Fake ProjectsListPage},
    ]
  },  
  { path: '/subscriptions',  name: `Subscriptions`, component: SubRouteSwitch, header: true, roles: ['manager'],sidebar: true,
    children: [      
      { path: '/', exact: true,icon: 'fa-solid fa-gear',name: `SubscriptionsSettings`, url:'/subscriptions/', component: Fake, sidebar: true, order:1},                 
      { path: '/libraries', exact: true,icon: 'fa-solid fa-file-contract',name: `LibrariesSubscriptionsList`, url:'/subscriptions/libraries', component: Fake, sidebar: true, order:2},                 
      { path: '/institutions', exact: true,icon: 'fa-solid fa-file-contract',name: `InstitutionsSubscriptionsList` , url:'/subscriptions/institutions', component: Fake, sidebar: true, order:3},                 
    ]
  },
  { path: '/payments',  name: 'Payments', component: SubRouteSwitch, header: true, roles: ['accountant'],sidebar: true,
    children: [      
      { path: '/', exact: true, icon: 'fa-solid fa-landmark', name: `Payments`, url: `/payments`, component: Fake,sidebar:true,order:1},      
    ]
  },*/
];

export default routes;
