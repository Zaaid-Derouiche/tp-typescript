// Afficher les paramètres et le résultat
export function Log(method: Function, context: ClassMethodDecoratorContext) {
  return function (this: any, ...args: any[]) {
    console.log(`[LOG] Méthode : ${String(context.name)}`);
    console.log("Paramètres :", args);

    const result = method.apply(this, args);

    console.log("Résultat :", result);

    return result;
  };
}

// Mesurer le temps d'exécution
export function MeasureTime(
  method: Function,
  context: ClassMethodDecoratorContext,
) {
  return function (this: any, ...args: any[]) {
    const start = Date.now();

    try {
      return method.apply(this, args);
    } finally {
      console.log(`[TIME] ${String(context.name)} : ${Date.now() - start} ms`);
    }
  };
}

// Vérifier la puissance d'un sort
export function ValidateSpellPower(
  method: Function,
  context: ClassMethodDecoratorContext,
) {
  return function (this: any, ...args: any[]) {
    const spell = args[0];

    if (spell.power < 0) {
      throw new Error("Spell power cannot be negative!");
    }

    return method.apply(this, args);
  };
}

// Mettre en cache les résultats
const caches = new WeakMap<object, Map<string, any>>();

export function Cache(method: Function, context: ClassMethodDecoratorContext) {
  return function (this: object, ...args: any[]) {
    let cache = caches.get(this);

    if (!cache) {
      cache = new Map();
      caches.set(this, cache);
    }

    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log("[CACHE] Résultat récupéré");
      return cache.get(key);
    }

    console.log("[CACHE] Nouveau calcul");

    const result = method.apply(this, args);

    cache.set(key, result);

    return result;
  };
}
