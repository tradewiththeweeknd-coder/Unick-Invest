class InvestmentController {
    constructor() {
        this.investments = [];
    }

    // Create a new investment
    createInvestment(type, amount, userId) {
        const investmentPlan = this.getInvestmentPlan(type);
        if (!investmentPlan) {
            throw new Error('Invalid investment type');
        }
        const investment = {
            id: this.investments.length + 1,
            type,
            amount,
            userId,
            startDate: new Date(),
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 365 days from now
            approved: false,
        };
        this.investments.push(investment);
        return investment;
    }

    // Get investment history for a user
    getInvestmentHistory(userId) {
        return this.investments.filter(investment => investment.userId === userId);
    }

    // Get active investment for a user
    getActiveInvestment(userId) {
        return this.investments.find(investment => investment.userId === userId && !investment.approved && new Date() < investment.endDate);
    }

    // Approve an investment
    approveInvestment(id) {
        const investment = this.investments.find(inv => inv.id === id);
        if (!investment) {
            throw new Error('Investment not found');
        }
        investment.approved = true;
        return investment;
    }

    // Get investment plan details
    getInvestmentPlan(type) {
        const plans = {
            TYPE1: { dailyReturn: 0.05 },
            TYPE2: { dailyReturn: 0.075 },
            TYPE3: { dailyReturn: 0.1 },
            TYPE4: { dailyReturn: 0.125 },
            TYPE5: { dailyReturn: 0.15 },
            TYPE6: { dailyReturn: 0.175 },
            TYPE7: { dailyReturn: 0.2 },
            TYPE8: { dailyReturn: 0.225 },
        };
        return plans[type];
    }
}

module.exports = InvestmentController;