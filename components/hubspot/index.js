import cn from 'clsx'
import { useStore } from 'lib/store'
import { Controller, useForm } from 'react-hook-form'
import {
  InputField,
  MultipleCheckboxField,
  SelectField,
  TextArea,
} from './input-fields'

import s from './hubspot.module.scss'

export const Hubspot = ({ fields = [], children }) => {
  const [setShowThanks] = useStore((state) => [state.setShowThanks])

  const { register, control, reset, handleSubmit, formState } = useForm({
    mode: 'onChange',
  })

  const { errors, isSubmitting, isValid } = formState

  const onSubmit = (input) => {
    console.log('Form submitted with values:', input)

    // Mock submission success
    setTimeout(() => {
      setShowThanks(true)
      setTimeout(() => {
        reset()
      }, 1500)
    }, 1000)
  }

  const helpers = {
    handlers: {
      handleSubmit,
      onSubmit,
      register,
      Controller,
      control,
      errors,
      MultipleCheckboxField,
      InputField,
      SelectField,
      isValid,
      isSubmitting,
      reset,
    },
    form: {
      id: 'mock-form-id',
      fields: fields,
      submitButton: { text: 'Submit' },
    },
    legalConsent: { text: 'I agree to the terms and conditions' },
  }

  return children(helpers)
}

const FieldTypeSwitcher = ({ field, input, handlers }) => {
  const { errors, InputField, SelectField, register } = handlers

  switch (input.type) {
    case 'text':
    case 'email':
      return (
        <InputField
          error={errors[input.name]}
          label={input.label}
          placeholder={input.placeholder || input.label}
          required={input.required}
          type={input.type}
          {...field}
        />
      )
    case 'number':
      return (
        <InputField
          error={errors[input.name]}
          label={input.label}
          placeholder={input.placeholder || input.label}
          required={input.required}
          type={input.type}
          {...field}
        />
      )
    case 'select':
      return (
        <SelectField
          label={input.label}
          placeholder={input.placeholder || 'Select...'}
          options={input.options || []}
          required={input.required}
          {...field}
        />
      )
    case 'checkbox':
      return (
        <MultipleCheckboxField
          label={input.label}
          options={input.options || []}
          required={input.required}
          register={register}
          name={input.name}
        />
      )
    case 'textarea':
      return (
        <TextArea
          error={errors[input.name]}
          label={input.label}
          placeholder={input.placeholder || input.label}
          required={input.required}
          {...field}
        />
      )
    default:
      return (
        <InputField
          error={errors[input.name]}
          label={input.label}
          placeholder={input.placeholder || input.label}
          required={input.required}
          type="text"
          {...field}
        />
      )
  }
}

const Form = ({ handlers, form, className, children, style }) => {
  const { handleSubmit, onSubmit, Controller, control, isValid, isSubmitting } =
    handlers

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(s.form, className)}
      style={style}
    >
      {form.fields.map((input, i) => {
        return (
          <div className={s.field} key={i}>
            <Controller
              name={input.name}
              control={control}
              defaultValue=""
              rules={{ required: input.required }}
              render={({ field }) => (
                <FieldTypeSwitcher
                  field={field}
                  input={input}
                  handlers={handlers}
                />
              )}
            />
          </div>
        )
      })}

      {children}

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className={cn('button', s.submit)}
      >
        {isSubmitting ? 'Submitting...' : form.submitButton?.text || 'Submit'}
      </button>
    </form>
  )
}

Hubspot.Form = Form
