import cn from 'clsx'
import { useState } from 'react'
import s from './contact-form.module.scss'

export function ContactForm({ className, fields, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.target)

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        e.target.reset()
        if (onSuccess) onSuccess()
      } else {
        const data = await response.json()
        console.error('Form submission error:', data)
      }
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateField = (e) => {
    const { name, value, required } = e.target

    if (required && !value.trim()) {
      setFormErrors((prev) => ({ ...prev, [name]: 'This field is required' }))
    } else {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn(s.form, className)}>
      {fields?.map((field, index) => (
        <div key={index} className={s.fieldGroup}>
          <label
            htmlFor={field.name}
            className={cn(s.label, 'p-s text-uppercase')}
          >
            {field.label}
            {field.required && <span className={s.required}>*</span>}
          </label>

          {field.type === 'textarea' ? (
            <textarea
              id={field.name}
              name={field.name}
              required={field.required}
              className={cn(s.input, s.textarea)}
              onBlur={validateField}
              rows={4}
            />
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type || 'text'}
              required={field.required}
              className={s.input}
              onBlur={validateField}
            />
          )}

          {formErrors[field.name] && (
            <p className={s.errorMessage}>{formErrors[field.name]}</p>
          )}
        </div>
      ))}

      <button
        type="submit"
        className={cn('button', s.submitButton)}
        disabled={isSubmitting || Object.keys(formErrors).length > 0}
      >
        {isSubmitting ? 'Sending...' : 'Submit'}
      </button>
    </form>
  )
}
