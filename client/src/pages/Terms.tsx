import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="relative min-h-screen bg-black text-neutral-100 overflow-hidden pt-16">
      <Navbar />
      <main className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              TERMS <span className="text-primary">&amp;</span> CONDITIONS
            </h1>
          </div>

          <div className="space-y-6 text-neutral-300 leading-relaxed">
            <p>
              The terms and conditions contained here shall be applied to our website and any other linked pages to it.
              Any user logging here shall be presumed to have read all the policies and terms clearly mentioned here.
              The terms of use never get changed or edited in any way or by any means with respect to our services.
              It is clearly mentioned that the funds will not be settled if the user has not completed his or her KYC or
              other verification details. We reserve the right to not release the settlement in case of any mistake from
              the user’s side.
            </p>
            <p>
              Clicking to accept the conditions, the user will legally be bound to remain to the terms of our service and
              agreements. We clearly do not provide any warranty, completeness or suitability of the information provided
              on our platform for any particular reason or purpose. Your usage of any information or any important and
              confidential data is at your own risk. Our company will not be held responsible for any loss. It is your
              utmost responsibility to keep a clear check and confirmation about your personal details.
            </p>
            <p>
              The website consists of data and content which is solely licensed to us. Reproduction or distribution is
              strictly prohibited other than the copyright notice which also serves as a huge part in the Terms and
              Conditions. Unauthorized use of our platform can be considered as a strict offence which may further lead to
              strict actions against the person and can be charged for a ‘Criminal Offence’.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
