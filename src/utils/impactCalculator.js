import { YIELD_RATE, NET_TO_IMPACT_RATE, EDUCATION_COST_PER_CHILD, LIVELIHOOD_COST_PER_PACKAGE, PESANTREN_COST_PER_STUDENT, UMKM_COST_PER_PACKAGE } from '../constants';

export const calculateImpact = (amount) => {
  const grossYield = amount * YIELD_RATE;
  const netYield = grossYield * NET_TO_IMPACT_RATE;

  const childrenEducated = Math.floor(netYield / EDUCATION_COST_PER_CHILD);
  const livelihoodPackages = Math.floor(netYield / LIVELIHOOD_COST_PER_PACKAGE);
  const pesantrenStudents = Math.floor(netYield / PESANTREN_COST_PER_STUDENT);
  const umkmPackages = Math.floor(netYield / UMKM_COST_PER_PACKAGE);

  // Projection over years (compound effect)
  const projections = [1, 3, 5, 10].map(years => {
    const totalYield = netYield * years;
    return {
      year: years,
      totalYield: totalYield,
      totalBeneficiaries: Math.floor(totalYield / 400), // Average cost per beneficiary
      childrenEducated: Math.floor(totalYield / EDUCATION_COST_PER_CHILD),
      livelihoodPackages: Math.floor(totalYield / LIVELIHOOD_COST_PER_PACKAGE)
    };
  });

  return {
    investment: amount,
    grossYield,
    netYield,
    overhead: grossYield - netYield,
    overheadPercent: (1 - NET_TO_IMPACT_RATE) * 100,
    childrenEducated,
    livelihoodPackages,
    pesantrenStudents,
    umkmPackages,
    projections,
    yieldRate: YIELD_RATE * 100,
    netToImpactRate: NET_TO_IMPACT_RATE * 100
  };
};

export const formatCurrency = (amount, currency = 'USD') => {
  const locale = currency === 'IDR' ? 'id-ID' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: currency === 'IDR' ? 0 : 2
  }).format(amount);
};

export const formatProjectCurrency = (project) => {
  if (project.currency === 'IDR' && project.allocatedLocal) {
    return formatCurrency(project.allocatedLocal, 'IDR');
  }
  return formatCurrency(project.allocated);
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};
