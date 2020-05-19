import * as React from "react";

import {
    Select,
    SelectProps,
    wrapFieldsWithMeta,
} from "tinacms";

import { Field, FormApi } from '@tinacms/forms'
import { FieldRenderProps } from '@tinacms/form-builder'

import {FieldsBuilder} from "./fields-builder";

interface FieldProps<InputProps> extends FieldRenderProps<any, HTMLElement> {
    field: Field & InputProps
    form: FormApi
}

const ContentBlock: React.SFC<FieldProps<SelectProps> & SelectProps> = (props) => {
    const value = props.input.value || props.field.options[0];
    const contentFields = (props.field as any).blockFields[value] || [];
    const field = props.field;
    const index = props.index;
    const fieldRoot = field.name.split(".").slice(0, -1).join(".");
    const fields: any[] = React.useMemo(() => {
        return contentFields.map((subField: any) => ({
            ...subField,
            name: `${fieldRoot}.${subField.name}`,
        }))
    }, [contentFields, fieldRoot, index]);
    return (
        <>
            {wrapFieldsWithMeta(Select)(props)}
            <FieldsBuilder form={props.tinaForm} fields={fields} />
        </>
    );
}

export const ContentBlockPlugin = {
    name: "content-block",
    Component: ContentBlock,
}