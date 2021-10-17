export interface ISystemStore {
  usersList: any[];
  usersCount: number;
  roleList: any[];
  roleCount: number;
  menuList: any[];
  menuCount: number;
  goodsList: any[];
  goodsCount: number;
}

export interface IPagePayloadFetch {
  pageName: string;
  queryInfo: any;
}

export interface IPagePayloadDelete {
  pageName: string;
  id: number;
}

export interface IPagePayloadCreate {
  pageName: string;
  newData: any;
}

export interface IPagePayloadEdit {
  pageName: string;
  id: number;
  editData: any;
}
