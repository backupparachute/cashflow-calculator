


document.addEventListener("DOMContentLoaded", function(){
  // Handler when the DOM is fully loaded
  console.log("loading event listenr...");

  document.querySelectorAll('input').forEach(item => {
    item.addEventListener('blur', event => {
		calcTotals(event);
    })
  })

    let searchParams = new URLSearchParams(window.location.search);
    let opr = searchParams.get('offer_price') || searchParams.get('opr');

    console.log("found opr param: "+opr);
    // bump for pages

    if (opr) {
      opr = Number(opr);
      console.log("setting opr = "+opr);
      document.querySelector('#offer-price').value = opr;
    }

  calcTotals();

});

function calcTotals(event) {
    console.log("calc totals...");

    // ########################################################################
    // Loan
    let offer_price = document.querySelector('#offer-price').value;
    // document.querySelector('#first .cap-raise').innerHTML = to_currency(first_cap_raise);

    let downpayment_perc = to_percent(document.querySelector('#downpayment-perc').value);
    // document.querySelector('#second .cap-raise').innerHTML = to_currency(sec_cap_raise);
    let downpayment = offer_price * downpayment_perc;
    document.querySelector('#downpayment').value = downpayment;

    let loanamount = offer_price - downpayment;
    document.querySelector('#loanamount').value = loanamount;
    // document.querySelector('#third .cap-raise').innerHTML = to_currency(third_cap_raise);

    let interest_rate_perc = to_percent(document.querySelector('#interest-rate').value);

    let term = document.querySelector('#term').value;

    let payment = calc_pmt(interest_rate_perc/12, term*12, loanamount).toFixed(2);
    document.querySelector('#payment').value = to_currency(payment);


    // ########################################################################
    // Revenue
    let monthly_revenue = document.querySelector('#monthly-revenue').value;
    let add_monthly_income = document.querySelector('#add-monthly-income').value;
    let total_income = monthly_revenue+add_monthly_income;
    document.querySelector('#total-income').value = total_income;

    // document.querySelector('#annual-gross-revenue').value = (total_income*12).toFixed(0);

    // ########################################################################
    // Expenses
    let operating_expenses = document.querySelector('#operating-expenses').value;

    document.querySelector('#sba-loan-payment').value = to_currency(payment);

    let investor_payments = document.querySelector('#investor-payments').value;
    let equipment_loans = document.querySelector('#equipment-loans').value;
    let seller_finance_payments = document.querySelector('#seller-finance-payments').value;

    let total_exp = Number(operating_expenses) + Number(payment) + Number(investor_payments) + Number(equipment_loans) + Number(seller_finance_payments);
    document.querySelector('#total-monthly-exp').value = to_currency(total_exp);

    // document.querySelector('#total-annual-exp').value = to_currency((total_exp*12).toFixed(0));

    // ########################################################################
    // Profit

    let monthly_income_minus_exp = total_income - total_exp;
    monthly_income_minus_exp = monthly_income_minus_exp.toFixed(2);
    document.querySelector('#monthly-income-minus-exp').value = to_currency(monthly_income_minus_exp);

    let annual_profit_before_debt_payback = (monthly_revenue - operating_expenses)*12;
    annual_profit_before_debt_payback = annual_profit_before_debt_payback.toFixed(0);
    document.querySelector('#annual-profit-before-debt-payback').value = to_currency(annual_profit_before_debt_payback);

    let profit_after_debt_payback = monthly_income_minus_exp*12;
    document.querySelector('#profit-after-debt-payback').value = to_currency(profit_after_debt_payback);

    // ########################################################################
    // Total Return
    let total_return_year_one = ((monthly_income_minus_exp*12)-downpayment)/downpayment;
    document.querySelector('#total-return-year-one').value = ((total_return_year_one)*100).toFixed(2);

    let total_return_year_two = ((monthly_income_minus_exp*24)-downpayment)/downpayment;
    document.querySelector('#total-return-year-two').value = ((total_return_year_two)*100).toFixed(2);

    let total_return_year_three = ((monthly_income_minus_exp*36)-downpayment)/downpayment;
    document.querySelector('#total-return-year-three').value = ((total_return_year_three)*100).toFixed(2);

    // ########################################################################
    // Multiple
    let purchase_price_two = annual_profit_before_debt_payback * document.querySelector('#multiple-sde-two').value;
    document.querySelector('#purchase-price-two').value = to_currency(purchase_price_two);

    let purchase_price_two_half = annual_profit_before_debt_payback * document.querySelector('#multiple-sde-two-half').value;
    document.querySelector('#purchase-price-two-half').value = to_currency(purchase_price_two_half);

    let purchase_price_three = annual_profit_before_debt_payback * document.querySelector('#multiple-sde-three').value;
    document.querySelector('#purchase-price-three').value = to_currency(purchase_price_three);

    // ########################################################################
    // Chart
    new Chartkick.PieChart("chart-1", [["Operating Expenses", operating_expenses], ["SBA Loan Payment", payment], ["Investor Payment",investor_payments],["Equipment Loans", equipment_loans],["Seller Financing Payments", seller_finance_payments]])

}

function to_percent(num) {
	if (num) {
		return 	(num / 100);
	}

	return 0;

}

function to_currency(num) {
	const formatter = new Intl.NumberFormat('en-US', {
	  style: 'currency',
	  currency: 'USD',
	  minimumFractionDigits: 2
	});
	return formatter.format(num);
}

// #############################################################################

function calc_cap_raise(val) {
	let tot_rnd_size = document.querySelector('#tot-rnd-size').value;

	let cap_raise = (val * tot_rnd_size);
  return cap_raise;
}

function calc_per_company_sold(raise, valuation) {
  if (!valuation || valuation <= 0) {
    return 0;
  }
	let val =  raise / valuation;
  return val*100;
}

// ********
// http://www.tvmcalcs.com/index.php/calculators/apps/lease_payments
// ********
// function calc_pmt(monthlyRate, monthlyPayments, presentValue, residualValue, advancedPayments) {
//   t1 = 1+monthlyRate
//   t2 = Math.pow(t1,monthlyPayments)
//   t3 = Math.pow(t1,(monthlyPayments-advancedPayments))
//   return (presentValue-(residualValue/t2))/(((1-(1/(t3)))/monthlyRate)+advancedPayments);
// }
function calc_pmt(ir,np, pv, fv = 0){
  // ir: interest rate
  // np: number of payment
  // pv: present value or loan amount
  // fv: future value. default is 0

  var presentValueInterstFector = Math.pow((1 + ir), np);
  var pmt = ir * pv  * (presentValueInterstFector + fv)/(presentValueInterstFector-1);
  return pmt;
}

function calc_per_rnd_acct() {
  let first_per = document.querySelector('#first_per_round').value;
  let second_per_sold = document.querySelector('#sec_per_round').value;
  let third_per_sold = document.querySelector('#third_per_round').value;

  return Number(first_per) + Number(second_per_sold) + Number(third_per_sold);

}
