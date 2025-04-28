import PropTypes from "prop-types";
import currencyCodes from "currency-codes";

const CurrencySelect = ({ register, errors }) => {
  const currencies = currencyCodes.data.map((currency) => currency.code);
  return (
    <select
      id='currency'
      aria-invalid={!!errors.currency}
      className={`form-input w-full ${errors.currency ? "border-error-dark" : ""}`}
      {...register("currency", { required: "Currency is required." })}>
      <option value=''>Select a currency</option>
      {currencies.map((currency) => (
        <option key={currency} value={currency}>
          {currency}
        </option>
      ))}
    </select>
  );
};

CurrencySelect.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

export default CurrencySelect;
