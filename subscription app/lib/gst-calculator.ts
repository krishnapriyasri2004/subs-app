export const calculateGST = (
    taxableAmount: number,
    gstRate: number,        // e.g. 18 for 18%
    sellerState: string,    // e.g. 'Tamil Nadu'
    buyerState: string      // e.g. 'Karnataka'
) => {
    // Basic normalization for comparison
    const normalizedSeller = sellerState.trim().toLowerCase();
    const normalizedBuyer = buyerState.trim().toLowerCase();

    const isInterState = normalizedSeller !== normalizedBuyer;

    if (isInterState) {
        return {
            igst: (taxableAmount * gstRate) / 100,
            cgst: 0,
            sgst: 0
        };
    } else {
        const half = (taxableAmount * gstRate) / 200;
        return {
            igst: 0,
            cgst: half,
            sgst: half
        };
    }
};
