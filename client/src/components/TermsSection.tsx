import React from 'react';
import UserAgreementText from '../content/UserAgreementText';

const TermsSection: React.FC = () => {
  return (
    <section className="relative py-16 sm:py-20 bg-neutral-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Terms & Conditions</h2>
          <p className="mt-3 text-neutral-400 max-w-2xl mx-auto">
            Please review the following agreement carefully before using our platform.
          </p>
        </div>
        <div className="p-4 sm:p-6 bg-yellow-900/20 border border-yellow-700 rounded-md max-h-64 overflow-y-auto text-sm text-yellow-200" style={{fontSize:'13px'}}>
          <strong className="block mb-2 text-yellow-300">User Agreement:</strong>
          <p>
            <UserAgreementText />
          </p>
        </div>
      </div>
    </section>
  );
};

export default TermsSection;
