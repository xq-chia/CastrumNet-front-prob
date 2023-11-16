import { Component, OnInit, ViewChild } from '@angular/core';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-user-edit',
  templateUrl: './edit.component.html'
})
export class UserEditComponent implements OnInit {
  record: any = {};
  i: any;
  schema: SFSchema = {
    properties: {
      userId: { type: 'number', title: 'User Id' },
      username: { type: 'string', title: 'Username' },
      password: { type: 'string', title: 'Password' },
      firstName: { type: 'string', title: 'First Name' },
      lastName: { type: 'string', title: 'Last Name' },
      tenantId: { type: 'number', title: 'Tenant' },
      status: { type: 'boolean', title: 'Status' }
    },
    required: ['userId', 'username', 'password', 'firstName', 'lastName', 'tenantId']
  };
  ui: SFUISchema = {
    $status: {
      checkedChildren: 'Active',
      unCheckedChildren: 'Frozen'
    }
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient
  ) {}

  ngOnInit(): void {
    if (this.record.userId > 0) {
      this.http.get(`/users/${this.record.userId}`).subscribe(res => {
        res.userId = res.user.userId;
        res.firstName = res.user.firstName;
        res.lastName = res.user.lastName;
        res.username = res.user.username;
        res.password = res.user.password;
        res.status = res.user.status;
        res.tenantId = res.tenant.tenantId;

        this.i = res;
      });
    }
  }

  edit(value: any): void {
    this.http.patch(`/users/${this.record.userId}`, value).subscribe(res => {
      this.modal.close(true);
    });
  }

  close(): void {
    this.modal.destroy();
  }
}