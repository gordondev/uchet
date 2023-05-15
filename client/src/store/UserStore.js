import { makeAutoObservable } from "mobx";

export default class UserStore {
  constructor() {
    this._isAuth = false;
    this._isActivated = false;
    this._isLocked = false;
    this._user = {};
    this._role = "USER";
    makeAutoObservable(this);
  }
  setRole(role_) {
    this._role = role_;
  }
  setIsAuth(bool) {
    this._isAuth = bool;
  }
  setUser(user) {
    this._user = user;
  }
  setLocked(bool) {
    this._isLocked = bool;
  }
  get isAuth() {
    return this._isAuth;
  }
  get isLocked() {
    return this._isLocked;
  }
  get user() {
    return this._user;
  }
  get role() {
    return this._role;
  }
}
