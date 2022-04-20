import * as vscode from 'vscode';
import ACS from './acs';
import MENUDEF from './menudef';
import ZScript from './zscript';
import * as wad from './wad';

export function activate(context: vscode.ExtensionContext) {
	wad.register(context);

	context.subscriptions.push(
		...ZScript,
		...ACS,
		...MENUDEF,
	);
}
