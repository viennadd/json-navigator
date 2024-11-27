import { Node, NodeProps, Position } from "@xyflow/react";

import { TableBody, TableCell, TableRow } from "@/components/ui/table";

import { BaseNode } from "@/components/base-node";
import { LabeledHandle } from "@/components/labeled-handle";
import { JsonField, getJsonType, isAggregatedType } from "@/Json";

type DatabaseSchemaNode = Node<{
  label: string;
  schema: JsonField[];
}>;

const JsonValueDisplayTableCell = (props: {entry: JsonField}) => {
  const { entry } = props;
  let displayValue = "";
  let extraClass = "";
  const jsonValue = entry.value;
  const valueType = getJsonType(jsonValue);
  if (valueType === 'array') {
    displayValue = `$array[]`
    extraClass += "text-yellow-900"
  }
  else if (valueType === 'object') {
    displayValue = `$object{}`
    extraClass += "text-rose-900"
  }
  else if (jsonValue === null) displayValue = valueType
  else if (valueType === 'string') {
    displayValue = `"${jsonValue}"`
    extraClass += "text-pink-500"
  }
  else {
    displayValue = jsonValue.toString()
    extraClass += "text-sky-500"
  }

  return <TableCell className="pr-0 text-right font-medium text-sm">
          <label className={`px-3 text-foreground p-0 ${extraClass}`}>{displayValue}</label>
        </TableCell>
}

export function DatabaseSchemaNode({
  data,
  selected,
}: NodeProps<DatabaseSchemaNode>) {
  return (
    <BaseNode className="p-0" selected={selected}>
      <h2 className="rounded-tl-md rounded-tr-md bg-secondary p-2 text-center text-sm text-muted-foreground">
        
        <LabeledHandle
          id={data.label}
          title={data.label}
          type="target"
          position={Position.Left}
        />
      </h2>
      {/* shadcn Table cannot be used because of hardcoded overflow-auto */}
      <table className="border-spacing-10 overflow-visible">
        <TableBody>
          {data.schema.map((entry: JsonField) => (
            <TableRow key={entry.title} className="relative text-xs">
              <TableCell className="pl-0 pr-6 font-light">
                <label className={`px-3 text-foreground p-0 text-slate-300`}>{entry.title}</label>
                
              </TableCell>
              <JsonValueDisplayTableCell entry={entry}></JsonValueDisplayTableCell>
              <TableCell className="pr-0 text-right font-thin">
                {
                  isAggregatedType(entry) ? 
                  <LabeledHandle
                    id={entry.title}
                    title={entry.type}
                    type="source"
                    position={Position.Right}
                    className="p-0 text-slate-600"
                    handleClassName="p-0"
                    labelClassName="p-0 text-slate-600"
                  /> :
                  <label className={`px-3 text-foreground p-0 text-slate-600`}>{entry.type}</label>
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </table>
    </BaseNode>
  );
}
