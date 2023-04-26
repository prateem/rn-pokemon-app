import {AppRoute} from "../flows/authenticated/AuthenticatedFlow";
import * as Linking from 'expo-linking';
import {CommonActions, StackActions, StackActionType, TabActions, TabActionType} from "@react-navigation/native";

export interface DeepLinkAction {
    action: CommonActions.Action | StackActionType | TabActionType
}

/**
 * Processes app route pathing into navigation controller actions.
 *
 * @param url: URL obtained from `Linking.useURL()`
 *
 * @example Show Pikachu entry
 * `/pokemon/25`
 *
 * @example Show Raichu entry, navigated to/pushed from Pikachu's entry
 * `/pokemon/25/pokemon/26`
 *
 * @example Show Youngster Joey's Ratata
 * `/trainer/1/pokemon/19`
 *
 * @example Show a Seaking belonging to Swimmer Briana from Misty's gym
 * `/gym/10/trainer/10005/pokemon/119`
 */
export function processDeepLink(url: string): Array<DeepLinkAction> {
    const { hostname, path, queryParams } = Linking.parse(url);

    console.log(
        `Linked to app with hostname: ${hostname}, path: ${path} and data: ${JSON.stringify(
            queryParams
        )}`
    );

    return processPath(path)
}

function processPath(path: string | null): Array<DeepLinkAction> {
    if (!path) {
        return []
    }

    const pathComponents = path
        .replace(/^\/+|\/+$/g, '')
        .split('/')

    const results: DeepLinkAction[] = []
    if (pathComponents.length > 0) {
        let idx = 0

        while (pathComponents.length > idx) {
            const target = pathComponents[idx++]

            try {
                switch (target) {
                    // Tab navigation
                    case 'pokedex':
                    case 'gyms':
                    case 'trainers': {
                        results.push({ action: TabActions.jumpTo(target) })
                        break
                    }

                    // Screen navigation
                    case 'pokemon': {
                        const param = pathComponents[idx++] // this entry expects a param
                        const params: AppRoute['pokemon'] = {number: parseInt(param)}
                        results.push({ action: StackActions.push(target, params) })
                        break
                    }
                    case 'trainer': {
                        const param = pathComponents[idx++] // this entry expects a param
                        const params: AppRoute['trainer'] = {id: parseInt(param)}
                        results.push({ action: StackActions.push(target, params) })
                        break
                    }
                    case 'gym': {
                        const param = pathComponents[idx++] // this entry expects a param
                        const params: AppRoute['gym'] = {number: parseInt(param)}
                        results.push({ action: CommonActions.navigate(target, params) })
                    }
                }
            } catch (e) {
                // eat it gracefully
            }
        }
    }

    return results
}
