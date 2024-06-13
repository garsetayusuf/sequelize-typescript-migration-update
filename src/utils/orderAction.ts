export default function orderActions(actions: any[]): any[] {
  const actionMap = new Map<string, any>();
  const dependencies = new Map<string, Set<string>>();

  // Initialize action map and dependencies map
  for (const action of actions) {
    actionMap.set(action.tableName, action);
    dependencies.set(action.tableName, new Set(action.depends));
  }

  const sortedActions: any[] = [];
  const visited = new Set<string>();

  // Function to recursively resolve dependencies
  function resolveDependencies(tableName: string) {
    if (visited.has(tableName)) return;
    visited.add(tableName);
    const action = actionMap.get(tableName)!;

    // Resolve dependencies recursively
    for (const dependency of action.depends) {
      if (!visited.has(dependency)) {
        resolveDependencies(dependency);
      }
    }

    // Add current action to sorted list
    sortedActions.push(action);
  }

  // Start resolving dependencies for each action
  for (const action of actions) {
    if (!visited.has(action.tableName)) {
      resolveDependencies(action.tableName);
    }
  }

  return sortedActions;
}
