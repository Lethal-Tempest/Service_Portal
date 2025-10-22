import React from 'react';
import { Users, Shield, Award, Clock } from 'lucide-react';
import { Card } from '../components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

export const About = () => {
  const { user } = useAuth() || {};
  const isWorker = user?.role === 'worker';


  const features = [
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Verified Professionals",
      description: "All workers are thoroughly verified with background checks and skill assessments."
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Secure Platform",
      description: "Your data and transactions are protected with industry-leading security measures."
    },
    {
      icon: <Award className="w-8 h-8 text-primary" />,
      title: "Quality Guaranteed",
      description: "We ensure high-quality service delivery with our rating and review system."
    },
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      title: "24/7 Support",
      description: "Our support team is available round-the-clock to help with any issues."
    }
  ];

  // const isWorker = user?.role === 'worker';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
            <h1
              className={`text-4xl md:text-5xl font-bold mb-6 ${
                isWorker
                  ? 'bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent'
                  : 'text-[#2979FF]'
              }`}
            >
              About WorkerConnect
            </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Connecting skilled professionals with customers who need their services. 
            We're building a trusted community where quality work meets fair opportunities.
          </p>
        </div>

        {/* Mission */}
        <div className="mb-16">
          <Card className="p-8 card-gradient">
              <h2
                className={`text-3xl font-bold mb-6 text-center ${
                  isWorker
                    ? 'bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent'
                    : 'text-gray-900'
                }`}
              >
                Our Mission
              </h2>
            <p className="text-lg text-gray-700 text-center">
              To bridge the gap between skilled workers and customers by providing a transparent, 
              secure, and efficient platform that empowers both parties to achieve their goals. 
              We believe in fair wages for workers and quality services for customers.
            </p>
          </Card>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2
            className={`text-3xl font-bold mb-12 text-center ${
              isWorker
                ? 'bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent'
                : 'text-gray-900'
            }`}
          >
            Why Choose Us
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center card-gradient hover-scale">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="text-center">
          <h2
            className={`text-3xl font-bold mb-12 ${
              isWorker
                ? 'bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent'
                : 'text-gray-900'
            }`}
          >
            Our Impact
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-[#2979FF] mb-2">5K+</div>
              <div className="text-gray-600">Verified Workers</div>
            </div>
            <div>
              <div
                  className={`text-4xl font-bold mb-2 ${
                    isWorker
                      ? 'bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent'
                      : 'text-[#2979FF]'
                  }`}
                >
                  10K+
                </div>
              <div className="text-gray-600">Jobs Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#2979FF] mb-2">4.9★</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
