/**
 * Copyright (c) 2022 PROPHESSOR
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { EventEmitter, Event, TextDocumentContentProvider, TreeDataProvider, workspace, Uri, TreeItem, CancellationToken, ProviderResult } from "vscode";
import ByteTools from "./ByteTools";
import { WadParser } from "./WadParser";

export class WadTreeDataProvider implements TreeDataProvider<TreeItem>, TextDocumentContentProvider {
  private _onDidChangeTreeData: EventEmitter<any> = new EventEmitter<any>();
  readonly onDidChangeTreeData: Event<any> = this._onDidChangeTreeData.event;

  private _wad: WadParser | null = null;

  private wadUri: string | null = null;

  get wad() {
    console.log('GET WAD', this._wad);
    return this._wad;
  }

  set wad(wad: WadParser | null) {
    console.log('SET WAD', wad);
    this._wad = wad;
  }

  constructor() {
    this.clear();
  }

  public async openWad(fileUri: Uri) {
    console.warn('openWad', fileUri);
    this.wadUri = fileUri.path;
    const buffer = await workspace.fs.readFile(fileUri);
    this.wad = new WadParser(new ByteTools(buffer as Buffer));
    await this.wad.parse();
    this._onDidChangeTreeData.fire(null);
  }

  public clear() {
    this.wad = null;
    this.wadUri = null;
    this._onDidChangeTreeData.fire(null);
  }

  public getTreeItem(element: TreeItem): TreeItem {
    if (this.wad?.lumps)
      element.command = {
        command: 'openWadResource',
        arguments: [String(element.label)],
        title: 'Open WAD Resource'
      }

    return element;
  }

  getChildren(element?: TreeItem): ProviderResult<TreeItem[]> {
    if (!this.wad?.lumps) {
      console.warn('no wad loaded');
      return [new TreeItem('No WAD file opened! Use "Context menu -> Explore Wad File" on a WAD file you would like to explore.')];
    }

    return this.wad.lumps.map((x): TreeItem => new TreeItem(x.name));
  }

  public provideTextDocumentContent(uri: Uri, token: CancellationToken): ProviderResult<string> {
    console.warn('getContent', uri);
    return "getContent";
  }
}