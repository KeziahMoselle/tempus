import React from 'react'
import { cleanup, render, fireEvent } from '@testing-library/react'
import './__mocks__/ipcRenderer'
import App from '../App'

describe('Welcome guide', () => {
  afterEach(cleanup)

  it('shows the welcome screen', () => {
    const { getByText } = render(<App />)
    expect(getByText('or Skip')).toBeTruthy()
  })

  it('shows the steps of the welcome screen', () => {
    const { getByText, getByAltText } = render(<App />)

    fireEvent.click(getByText('Discover'))
    expect(getByAltText('preview 1')).toBeTruthy()

    const nextBtn = getByText('Next')

    fireEvent.click(nextBtn)
    expect(getByAltText('preview 2')).toBeTruthy()

    fireEvent.click(nextBtn)
    expect(getByAltText('preview 3')).toBeTruthy()

    fireEvent.click(nextBtn)
    expect(getByAltText('preview 4')).toBeTruthy()

    fireEvent.click(nextBtn)
    expect(getByAltText('preview 5')).toBeTruthy()

    fireEvent.click(nextBtn)
    expect(getByAltText('preview 6')).toBeTruthy()

    fireEvent.click(nextBtn)
    expect(getByAltText(`Thank's`)).toBeTruthy()
  })

  it('hides the welcome screen on skip', () => {
    const { getByText } = render(<App />)
    fireEvent.click(getByText('or Skip'))
    expect(getByText('play_arrow')).toBeTruthy()
  })
})
