import { Groups } from './index'

/**
 * In this example utility functions are attached
 * to the component constructor as a static method
 * 
 * We do this because without submodules it's otherwise
 * difficult to export related code without congesting
 * the root namespace.
 */
const Util = () => {
  return (
    <Groups
      belongsTo={"hello"}

      belongsTo={Groups.any(["hello", "world"])}

      belongsTo={Groups.all(["hello", "world"])}

      belongsTo={groups => ["some", "custom", "algorithm"]}
    >
      hello world
    </Groups>
  )
}

/**
 * In this example there is a disciminated union in the
 * component props which notify typescript users when
 * they break the rules.
 * 
 * For javascript users there is a runtime error:
 * "Only one allowed: belongsTo, belongsToAny, belongsToAll"
 */
const Union = () => {
  return (
    <Groups
      belongsTo={"hello"}

      belongsToAny={["hello", "world"]}

      belongsToAll={["hello", "world"]}
    >
      hello world
    </Groups>
  )
}