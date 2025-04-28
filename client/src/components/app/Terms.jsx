const Terms = () => {
  return (
    <section className='py-12 min-h-screen'>
      <div className='container mx-auto px-4'>
        <h1 className='text-2xl font-bold mb-4'>TERMS & CONDITIONS</h1>

        <section className='mb-4'>
          <h2 className='text-xl font-semibold mb-2'>Risk Notice</h2>
          <p>
            Trading foreign exchange on margin involves significant risk and may not be suitable for
            all investors. The company assumes all risks associated with trading activities. Please
            evaluate your financial condition and risk tolerance before engaging in trading.
          </p>
        </section>

        <section className='mb-4'>
          <h2 className='text-xl font-semibold mb-2'>Severability</h2>
          <p>
            If any section of this Agreement is declared invalid or void by a court, the remaining
            sections shall remain in full force and effect.
          </p>
        </section>

        <section className='mb-4'>
          <h2 className='text-xl font-semibold mb-2'>Customer Input Errors</h2>
          <p>
            The company is responsible for verifying the accuracy of information entered and saved
            on the website. In case of incorrect information leading to funds being transferred to
            an unintended destination, the company will reimburse the customer and ensure the
            correct transfer of additional funds. Customers should double-check their Bitcoin
            address and bank information for accuracy.
          </p>
        </section>

        <section className='mb-4'>
          <h2 className='text-xl font-semibold mb-2'>Binding Agreement</h2>
          <p>
            The terms of this Agreement are binding upon your heirs, successors, assigns, and other
            representatives. This Agreement may be executed in counterparts, each of which is an
            original, but both together constitute the same Agreement.
          </p>
        </section>

        <section className='mb-4'>
          <h2 className='text-xl font-semibold mb-2'>Expired Orders</h2>
          <p>
            If payment is received for an expired order, the company will recalculate the Bitcoin to
            Dollar rate at the time of processing the transfer. The customer will receive the
            recalculated amount, which may differ from the original order.
          </p>
        </section>

        <section>
          <h2 className='text-xl font-semibold mb-2'>Choice of Law</h2>
          <p>
            This Agreement shall be governed exclusively by the laws of the State of California,
            without regard to its conflict of law rules. You consent to the exclusive jurisdiction
            of the federal and state courts located in California.
          </p>
        </section>
      </div>
    </section>
  );
};

export default Terms;
