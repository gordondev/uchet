import {makeAutoObservable} from "mobx";

export default class ChecklistStore {
	constructor() {
		this._versions = []
		this._selectedVersion = null
		makeAutoObservable(this);
	}
	setSelectedVersion(version) {
        this._selectedVersion = version
    }
    get selectedVersion() {
        return this._selectedVersion
    }
}