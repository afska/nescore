import _ from "lodash";

/**
 * Creates an object from `items` with:
 * - `item.name` as keys
 * - `{ ...item, id: INTEGER }` as values
 */
export default (items) => {
  _(items)
    .map((item, i) => {
      return { ...item, id: i };
    })
    .reduce((acum, elem) => {
      return { ...acum, [elem.name]: elem };
    }, {});
};
