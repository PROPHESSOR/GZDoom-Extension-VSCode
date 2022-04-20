/**
 * Copyright (c) 2022 PROPHESSOR
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { EventEmitter, Event, TextDocumentContentProvider, TreeDataProvider, workspace, Uri, TreeItem, CancellationToken, ProviderResult, FileSystemError } from "vscode";
import ByteTools from "./ByteTools";
import { WadLump, WadParser } from "./WadParser";
import { join } from 'path';

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
    console.warn('openWad', buffer);
    this.wad = new WadParser(new ByteTools(buffer as Buffer));
    console.warn('openWad', this.wad);
    await this.wad.parse();
    this._onDidChangeTreeData.fire(null);
    console.warn('openWad OK');
  }

  public clear() {
    this.wad = null;
    this._onDidChangeTreeData.fire(null);
  }

  public getTreeItem(element: TreeItem): TreeItem {
    console.log('getTreeItem', element);
    element.command = {
      command: 'openWadResource',
      arguments: [String(element.label)],
      title: 'Open WAD Resource'
    }
    return element;
    // let command = undefined;

    // command = {
    //   command: 'openWadResource',
    //   arguments: [Uri.from({
    //     scheme: 'wad',
    //     path: join(element.name)
    //   })],
    //   title: 'Open WAD Resource'
    // }

    // return {
    //   label: element.name,
    //   collapsibleState: void 0,
    //   command: command,
    //   // iconPath: this.getIcon(element),
    //   // contextValue: this.getType(element)
    // }
  }

  getChildren(element?: TreeItem): ProviderResult<TreeItem[]> {
    console.log('getChilren', element);

    if (!this.wad?.lumps) {
      console.warn('no wad loaded');
      return [new TreeItem('No WAD file opened! Use "Context menu -> Explore Wad File" on a WAD file you would like to explore.')];
    }

    // if (!element) {
    return this.wad.lumps.map((x): TreeItem => new TreeItem(x.name));
    // }

    // return element.children;
  }

  public provideTextDocumentContent(uri: Uri, token: CancellationToken): ProviderResult<string> {
    console.warn('getContent', uri);
    return "getContent";
  }
}