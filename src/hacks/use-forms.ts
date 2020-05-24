/**

Copyright 2019 Forestry.io Inc

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

import { FormOptions, Form, Field } from '@tinacms/forms'
import * as React from 'react'

export interface WatchableFormValue {
  values: any
  label: FormOptions<any>['label']
  fields: FormOptions<any>['fields']
}

/**
 * A hook that creates a form and updates it's watched properties.
 */
export function useForms<FormShape = any>(formOptions: {
  options: FormOptions<any>,
  watch: Partial<WatchableFormValue>,
}[]): [FormShape[], Form[]] {
  /**
   * `initialValues` will be usually be undefined if `loadInitialValues` is used.
   *
   * If the form helper is using `watch.values`, which would contain
   * the current state of the form, then we set that to the `initialValues`
   * so the form is initialized with some state.
   *
   * This is beneficial for SSR and will hopefully not be noticeable
   * when editing the site as the actual `initialValues` will be set
   * behind the scenes.
   */
  for (let options of formOptions) {
    options.options.initialValues = options.options.initialValues || options.watch.values
  }

  const [, setValues] = React.useState(() => formOptions.map(o => o.options.initialValues))
  const [forms, setForms] = React.useState(() => formOptions.map((o, index) => (
    createForm(o.options, (form: any) => {
      setValues(form.values)
    })
  )));

  React.useEffect(
    function() {
      setForms(formOptions.map((o, index) => (
        createForm(o.options, (form: any) => {
          setValues(form.values)
        })
      )))
    },
    [formOptions.map(o => o.options.id).join(",")]
  )

  React.useEffect(() => {
    for (let formIndex in forms) {
        const form = forms[formIndex];
        const options = formOptions[formIndex].options;
        if (options.loadInitialValues) {
            options.loadInitialValues().then((values: any) => {
                form.updateInitialValues(values)
            })
        }
    }
  }, [forms, formOptions.map(o => o.options.id).join(",")])

  useUpdateFormFields(forms, formOptions.map(o => o.watch.fields!))
  useUpdateFormLabel(forms, formOptions.map(o => o.watch.label!))
  useUpdateFormValues(forms, formOptions.map(o => o.watch.values))

  return [formOptions.map((o, index) => forms[index] && forms[index].values || o.options.initialValues), forms]
}

function createForm(options: FormOptions<any>, handleChange: any): Form {
  const form = new Form(options)
  form.subscribe(handleChange, { values: true })
  return form
}

/**
 * A React Hook that update's the `Form` if `fields` are changed.
 *
 * This hook is useful when dynamically creating fields, or updating
 * them via hot module replacement.
 */
function useUpdateFormFields(forms: Form[], fields?: (Field[])[]) {
  React.useEffect(() => {
    if (typeof fields === 'undefined') return
    for (let formIndex in forms) {
      if (fields[formIndex] !== undefined) forms[formIndex].updateFields(fields[formIndex])
    }
  }, [forms, fields])
}

/**
 * A React Hook that update's the `Form` if the `label` is changed.
 *
 * This hook is useful when dynamically creating creating the label,
 * or updating it via hot module replacement.
 */
function useUpdateFormLabel(forms: Form[], labels?: string[]) {
  React.useEffect(() => {
    if (typeof labels === 'undefined') return
    for (let formIndex in forms) {
      if (labels[formIndex] !== undefined) forms[formIndex].label = labels[formIndex];
    }
  }, [forms, labels])
}

/**
 * Updates the Form with new values.
 *
 * Only updates fields that are:
 *
 * 1. registered with the form
 * 2. not currently [active](https://final-form.org/docs/final-form/types/FieldState#active)
 *
 * This hook is useful when the form must be kept in sync with the data source.
 */
function useUpdateFormValues(forms: Form[], values?: any[]) {
  React.useEffect(() => {
    if (typeof values === 'undefined') return
    for (let formIndex in forms) {
      if (values[formIndex] !== undefined) forms[formIndex].updateValues(values[formIndex]);
    }
  }, [forms, values])
}
