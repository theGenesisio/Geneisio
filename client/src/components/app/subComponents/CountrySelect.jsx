import { useCountries } from "use-react-countries";
import PropTypes from "prop-types";

const CountrySelect = ({ register, errors }) => {
  const { countries } = useCountries();

  // Sort countries alphabetically by name
  const sortedCountries = countries.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className='mb-4'>
      <select
        id='country'
        className={`form-input w-full ${errors.country ? "border-error-dark" : ""}`}
        {...register("country", { required: "Country is required." })}>
        <option value=''>Select country</option>
        {sortedCountries.map((country) => (
          <option key={country.name} value={country.name}>
            {country.name}
          </option>
        ))}
      </select>
    </div>
  );
};

CountrySelect.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

export default CountrySelect;
