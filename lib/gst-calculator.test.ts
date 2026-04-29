import { describe, it, expect } from 'vitest'
import { calculateGST } from './gst-calculator'

describe('calculateGST', () => {
    it('calculates CGST and SGST correctly for intra-state transactions', () => {
        const result = calculateGST(100, 18, 'Tamil Nadu', 'Tamil Nadu')
        expect(result.igst).toBe(0)
        expect(result.cgst).toBe(9)
        expect(result.sgst).toBe(9)
    })

    it('calculates IGST correctly for inter-state transactions', () => {
        const result = calculateGST(100, 18, 'Tamil Nadu', 'Karnataka')
        expect(result.igst).toBe(18)
        expect(result.cgst).toBe(0)
        expect(result.sgst).toBe(0)
    })
})
