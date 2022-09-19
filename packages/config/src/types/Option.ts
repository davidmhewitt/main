import type { ObjectWithName, AnyObject } from "./Common";

const STRING_TYPE = "string";
const NUMBER_TYPE = "number";
const BOOLEAN_TYPE = "boolean";
const OBJECT_TYPE = "object";
const ARRAY_TYPE = "array";
const NULL_TYPE = "null";

export const types = {
  STRING: STRING_TYPE,
  NUMBER: NUMBER_TYPE,
  BOOLEAN: BOOLEAN_TYPE,
  OBJECT: OBJECT_TYPE,
  ARRAY: ARRAY_TYPE,
  NULL: NULL_TYPE,
}

export type OptionType = typeof types.STRING | typeof types.NUMBER | typeof types.BOOLEAN | typeof types.OBJECT | typeof types.ARRAY | typeof types.NULL;
export type ItemsType = typeof types.STRING | typeof types.NUMBER | typeof types.BOOLEAN | typeof types.OBJECT;

export type OptionSingleValue = boolean | number | string | AnyObject
export type OptionArrayValue = boolean[] | number[] | string[] | AnyObject[]

export interface BaseOption  extends ObjectWithName {
  nullable: boolean,
}

export interface OptionBoolean extends BaseOption {
  type: typeof types.BOOLEAN
  value: boolean
  default?: boolean
}

export interface OptionNumber extends BaseOption {
  type: typeof types.NUMBER
  value: number
  default?: number
}

export interface OptionString extends BaseOption {
  type: typeof types.STRING
  value: string
  default?: string
}

export interface OptionObject extends BaseOption {
  type: typeof types.OBJECT
  value: AnyObject
  default?: AnyObject
}

export interface OptionArray extends BaseOption {
  type: typeof types.ARRAY
  value: OptionArrayValue
  itemsType: ItemsType
  default?: OptionArrayValue
}

export interface OptionNull extends BaseOption {
  type: typeof types.NULL
  value: null
  default?: null
}

export type Option = OptionBoolean | OptionNumber | OptionString | OptionObject | OptionArray | OptionNull
export type Options = Option[]
