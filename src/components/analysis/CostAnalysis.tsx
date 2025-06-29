
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart } from "lucide-react";

export const CostAnalysis = () => {
  const analysisData = {
    totalBudget: 50000,
    spentAmount: 23450,
    pendingOrders: 8950,
    availableBalance: 17600,
    topExpenses: [
      { category: "Cell Culture Media", amount: 8500, percentage: 36 },
      { category: "Antibodies", amount: 6200, percentage: 26 },
      { category: "Enzymes & Reagents", amount: 4800, percentage: 20 },
      { category: "Plasticware", amount: 2950, percentage: 13 },
      { category: "Equipment Rental", amount: 1000, percentage: 5 }
    ],
    monthlyTrends: [
      { month: "Oct", budget: 12000, actual: 11200 },
      { month: "Nov", budget: 15000, actual: 14800 },
      { month: "Dec", budget: 18000, actual: 16500 }
    ]
  };

  const utilizationPercentage = (analysisData.spentAmount / analysisData.totalBudget) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Cost Analysis</h2>
        <p className="text-gray-600">Track your research budget and spending patterns</p>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${analysisData.totalBudget.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Amount Spent</p>
                <p className="text-2xl font-bold text-red-600">
                  ${analysisData.spentAmount.toLocaleString()}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-yellow-600">
                  ${analysisData.pendingOrders.toLocaleString()}
                </p>
              </div>
              <ShoppingCart className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available Balance</p>
                <p className="text-2xl font-bold text-green-600">
                  ${analysisData.availableBalance.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Utilization */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Utilization</CardTitle>
          <CardDescription>
            Current spending progress: {utilizationPercentage.toFixed(1)}% of total budget
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={utilizationPercentage} className="h-3" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>$0</span>
              <span className="font-medium">
                ${analysisData.spentAmount.toLocaleString()} spent
              </span>
              <span>${analysisData.totalBudget.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>Top Expense Categories</CardTitle>
          <CardDescription>Where your research funds are being allocated</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysisData.topExpenses.map((expense, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{expense.category}</span>
                    <span className="text-sm text-gray-600">
                      ${expense.amount.toLocaleString()} ({expense.percentage}%)
                    </span>
                  </div>
                  <Progress value={expense.percentage} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Spending Trends</CardTitle>
          <CardDescription>Comparison of budgeted vs actual spending</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysisData.monthlyTrends.map((trend, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-12 text-sm font-medium text-gray-600">{trend.month}</div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Budget: ${trend.budget.toLocaleString()}</span>
                    <span>Actual: ${trend.actual.toLocaleString()}</span>
                  </div>
                  <div className="relative">
                    <Progress value={(trend.actual / trend.budget) * 100} className="h-2" />
                  </div>
                  <div className="text-xs text-gray-500">
                    {trend.actual < trend.budget ? 
                      `Under budget by $${(trend.budget - trend.actual).toLocaleString()}` :
                      `Over budget by $${(trend.actual - trend.budget).toLocaleString()}`
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
