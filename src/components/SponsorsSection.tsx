import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

/**
 * Sponsor board — styled like the step-and-repeat backdrop at a race finish.
 *
 * Logos are sized by area, not by height: each one gets roughly the same visual
 * weight, so a wide wordmark (Solid Gold) is shorter and a compact mark
 * (We are family) is taller. `ratio` is the trimmed image's width / height.
 */
interface Sponsor {
  name: string;
  file: string;
  ratio: number;
}

const SPONSORS: Sponsor[] = [
  { name: 'MSD Animal Health', file: 'msd-animal-health', ratio: 2.62 },
  { name: 'Thonglor Pet Hospital', file: 'thonglor-pet-hospital', ratio: 1.48 },
  { name: 'Dr.Choice', file: 'dr-choice', ratio: 1.58 },
  { name: 'We are family for PET', file: 'we-are-family-for-pet', ratio: 1.2 },
  { name: 'VIF', file: 'vif', ratio: 1.48 },
  { name: 'Kitchen Flavor', file: 'kitchen-flavor', ratio: 1.47 },
  { name: 'Solid Gold', file: 'solid-gold', ratio: 3.77 },
];

// Target visual area per logo (px², at desktop scale).
const LOGO_AREA = 11000;
const MAX_WIDTH = 210;

function logoSize(ratio: number) {
  let width = Math.sqrt(LOGO_AREA * ratio);
  if (width > MAX_WIDTH) width = MAX_WIDTH;
  return { width: Math.round(width), height: Math.round(width / ratio) };
}

export const SponsorsSection: React.FC = () => {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="sponsors"
      aria-labelledby="sponsors-heading"
      className="py-14 sm:py-20 relative overflow-hidden"
    >
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8 sm:mb-10 text-center">
          <h2 id="sponsors-heading" className="text-4xl sm:text-5xl font-bold text-[#2A1450]">
            ผู้สนับสนุนงาน
          </h2>
          <p className="mt-2 text-sm sm:text-base font-medium text-[#4B2D78]">
            ขอบคุณทุกแบรนด์ที่ร่วมดูแลนักวิ่งและน้องหมาในงานนี้
          </p>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="sponsor-board relative rounded-[28px] bg-white border-[3px] border-[#2A1450] shadow-[0_10px_0_#2A1450] overflow-hidden"
        >
          {/* Race-tape edge along the top of the board */}
          <div
            aria-hidden="true"
            className="h-3 w-full"
            style={{
              background:
                'repeating-linear-gradient(135deg, #FFC928 0 14px, #2A1450 14px 28px)',
            }}
          />

          <ul className="flex flex-wrap justify-center px-3 sm:px-6 py-6 sm:py-10 [--logo-scale:0.62] sm:[--logo-scale:0.82] lg:[--logo-scale:1]">
            {SPONSORS.map((s) => {
              const { width, height } = logoSize(s.ratio);
              return (
                <li
                  key={s.file}
                  className="basis-1/2 sm:basis-1/3 lg:basis-1/4 flex items-center justify-center px-2 py-4 sm:py-6 min-h-[96px] sm:min-h-[130px] lg:min-h-[150px]"
                >
                  <img
                    src={`/images/sponsors/${s.file}.webp`}
                    alt={s.name}
                    loading="lazy"
                    decoding="async"
                    width={width}
                    height={height}
                    style={{
                      width: `calc(${width}px * var(--logo-scale))`,
                      height: `calc(${height}px * var(--logo-scale))`,
                    }}
                    className="object-contain max-w-full"
                  />
                </li>
              );
            })}
          </ul>
        </motion.div>

        <p className="mt-6 text-center text-xs sm:text-sm font-medium text-[#6B5A85]">
          สนใจร่วมเป็นผู้สนับสนุน ติดต่อทีมผู้จัดงานได้ที่ช่องทางด้านล่างของหน้า
        </p>
      </div>
    </section>
  );
};
