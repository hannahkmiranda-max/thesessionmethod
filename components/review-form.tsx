'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ReviewForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [rating, setRating] = useState(5)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    content: '',
    trading_experience: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.from('reviews').insert({
        name: formData.name,
        email: formData.email,
        rating,
        title: formData.title,
        content: formData.content,
        trading_experience: formData.trading_experience
      })

      if (error) throw error
      
      setSubmitted(true)
      setFormData({ name: '', email: '', title: '', content: '', trading_experience: '' })
      setRating(5)
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="review-trigger-btn"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 20h9"/>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
        Share Your Experience
      </button>
    )
  }

  return (
    <div className="review-form-overlay" onClick={() => setIsOpen(false)}>
      <div className="review-form-modal" onClick={(e) => e.stopPropagation()}>
        <button className="review-close-btn" onClick={() => setIsOpen(false)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {submitted ? (
          <div className="review-success">
            <div className="review-success-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h3>Thank You!</h3>
            <p>Your review has been submitted and is pending approval. We appreciate your feedback!</p>
            <button onClick={() => { setSubmitted(false); setIsOpen(false); }} className="review-done-btn">
              Done
            </button>
          </div>
        ) : (
          <>
            <h2 className="review-form-title">Share Your Experience</h2>
            <p className="review-form-subtitle">Help other traders by sharing your journey with The Session Method</p>

            <form onSubmit={handleSubmit} className="review-form">
              <div className="review-rating-section">
                <label>Your Rating</label>
                <div className="review-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`review-star ${star <= rating ? 'active' : ''}`}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill={star <= rating ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <div className="review-field">
                <label htmlFor="name">Your Name *</label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="John D."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="review-field">
                <label htmlFor="email">Email Address *</label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <span className="review-field-note">Your email will not be displayed publicly</span>
              </div>

              <div className="review-field">
                <label htmlFor="experience">Trading Experience</label>
                <select
                  id="experience"
                  value={formData.trading_experience}
                  onChange={(e) => setFormData({ ...formData, trading_experience: e.target.value })}
                >
                  <option value="">Select your experience level</option>
                  <option value="beginner">Beginner (0-1 years)</option>
                  <option value="intermediate">Intermediate (1-3 years)</option>
                  <option value="advanced">Advanced (3-5 years)</option>
                  <option value="professional">Professional (5+ years)</option>
                </select>
              </div>

              <div className="review-field">
                <label htmlFor="title">Review Title *</label>
                <input
                  id="title"
                  type="text"
                  required
                  placeholder="e.g., Finally a system that makes sense!"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="review-field">
                <label htmlFor="content">Your Review *</label>
                <textarea
                  id="content"
                  required
                  rows={5}
                  placeholder="Share your experience with The Session Method. How has it helped your trading?"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>

              <button type="submit" className="review-submit-btn" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="review-spinner"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
