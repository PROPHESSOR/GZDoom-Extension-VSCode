/**
 * Copyright (c) 2022 PROPHESSOR
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { ExtensionContext, window, workspace, commands, Uri, TextDocument } from "vscode";
import * as vscode from 'vscode';
import { WadTreeDataProvider } from "./WadTreeDataProvider";

export function register(context: ExtensionContext) {
  const wadTreeDataProvider = new WadTreeDataProvider();

  window.registerTreeDataProvider('wadExplorer', wadTreeDataProvider);
  workspace.registerTextDocumentContentProvider('wad', wadTreeDataProvider);

  commands.registerCommand('wadexplorer.exploreWadFile', async (uri: Uri) => {
    console.log('wadexplorer.exploreWadFile', uri);
    await wadTreeDataProvider.openWad(uri);
  });

  commands.registerCommand('wadexplorer.clear', () => {
    wadTreeDataProvider.clear();
  });

  commands.registerCommand('openWadResource', async (lump: string) => {
    const lumps = wadTreeDataProvider.wad?.getLumpsByName(lump);

    if (!lumps?.length) return;

    const lumpData = lumps[0].read().buffer.toString('utf8');

    const doc = await vscode.workspace.openTextDocument({ content: lumpData });
    await vscode.window.showTextDocument(doc, 1, false);
  });
}