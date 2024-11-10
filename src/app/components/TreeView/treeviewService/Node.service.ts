
import { Injectable } from '@angular/core';
// import { TreeNode } from 'primeng/api';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TreeNode } from '../treeviewModels/TreeNode';
import { AuthService } from '../../Login/authServices/auth.service';

@Injectable()
export class NodeService {
  //private readonly baseUrl: string = environment.apiUrl+'/Treeview';
  private baseUrl = 'https://localhost:7259/api/Treeview/GenerateTreeViewData';
  constructor(private http: HttpClient,private authService: AuthService) {

  }
  // getFiles(): Promise<TreeNode[]> {
  //   return new Promise((resolve) => {
  //     resolve([
  //       {
  //         key: '0',
  //         label: 'Documents',
  //         data: 'Documents Folder',
  //         icon: 'pi pi-fw pi-inbox',
  //         children: [
  //           {
  //             key: '0-0',
  //             label: 'Work',
  //             data: 'Work Folder',
  //             icon: 'pi pi-fw pi-cog',
  //             children: [
  //               {
  //                 key: '0-0-0',
  //                 label: 'Expenses.doc',
  //                 icon: 'pi pi-fw pi-file',
  //                 data: 'Expenses Document',
  //                 children: [
  //                   {
  //                     key: '0-0-0-0',
  //                     label: 'Level 4 Document',
  //                     icon: 'pi pi-fw pi-file',
  //                     data: 'Document for Level 5',
  //                     children: [
  //                       {
  //                         key: '0-0-0-0-0',
  //                         label: 'Level 5 Document',
  //                         icon: 'pi pi-fw pi-file',
  //                         data: 'Document for Level 6',
  //                         children: [
  //                           {
  //                             key: '0-0-0-0-0-0',
  //                             label: 'Level 6 Document',
  //                             icon: 'pi pi-fw pi-file',
  //                             data: 'Document for Level 7',
  //                             children: [
  //                               {
  //                                 key: '0-0-0-0-0-0-0',
  //                                 label: 'Level 7 Document',
  //                                 icon: 'pi pi-fw pi-file',
  //                                 data: 'Document for Level 7'
  //                               }
  //                             ]
  //                           }
  //                         ]
  //                       }
  //                     ]
  //                   }
  //                 ]
  //               },
  //               {
  //                 key: '0-0-1',
  //                 label: 'Resume.doc',
  //                 icon: 'pi pi-fw pi-file',
  //                 data: 'Resume Document'
  //               }
  //             ]
  //           },
  //           {
  //             key: '0-1',
  //             label: 'Home',
  //             data: 'Home Folder',
  //             icon: 'pi pi-fw pi-home',
  //             children: [
  //               {
  //                 key: '0-1-0',
  //                 label: 'Invoices.txt',
  //                 icon: 'pi pi-fw pi-file',
  //                 data: 'Invoices for this month',
  //                 children: [
  //                   {
  //                     key: '0-1-0-0',
  //                     label: 'Level 4 Invoice',
  //                     icon: 'pi pi-fw pi-file',
  //                     data: 'Invoice for Level 4',
  //                     children: [
  //                       {
  //                         key: '0-1-0-0-0',
  //                         label: 'Level 5 Invoice',
  //                         icon: 'pi pi-fw pi-file',
  //                         data: 'Invoice for Level 5',
  //                         children: [
  //                           {
  //                             key: '0-1-0-0-0-0',
  //                             label: 'Level 6 Invoice',
  //                             icon: 'pi pi-fw pi-file',
  //                             data: 'Invoice for Level 6',
  //                             children: [
  //                               {
  //                                 key: '0-1-0-0-0-0',
  //                                 label: 'Level 6 Invoice',
  //                                 icon: 'pi pi-fw pi-file',
  //                                 data: 'Invoice for Level 6'
  //                               }
  //                             ]
  //                           }
  //                         ]
  //                       }
  //                     ]
  //                   }
  //                 ]
  //               }
  //             ]
  //           }
  //         ]
  //       }
  //     ]);
  //   });
  // }

  generateTreeViewData(): Observable<any> {
    const token = this.authService.getToken(); // Assuming AuthService has a method to get the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(this.baseUrl, { headers });
  }
  // Fetches available routes
  fetchRoutes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/GetRoutes`);
  }
}

