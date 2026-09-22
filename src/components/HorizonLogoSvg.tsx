import React from 'react';

export interface HorizonLogoProps {
  size?: number;
  color?: string;
  textColor?: string;
  glow?: boolean;
  variant?: 'full' | 'icon';
  className?: string;
  style?: React.CSSProperties;
}

// Exact compound vector path for the wordmark "HORIZON" with cutout holes for O, R, O
const HORIZON_TEXT_PATH = `M 430,350 L 430,425 L 445,425 L 445,393 L 446,392 L 474,392 L 475,393 L 475,425 L 490,425 L 490,350 L 475,350 L 475,379 L 474,380 L 446,380 L 445,379 L 445,350 Z M 531,349 L 530,350 L 527,350 L 526,351 L 524,351 L 523,352 L 522,352 L 521,353 L 520,353 L 519,354 L 518,354 L 509,363 L 509,364 L 508,365 L 508,366 L 507,367 L 507,368 L 506,369 L 506,371 L 505,372 L 505,374 L 504,375 L 504,380 L 503,381 L 503,394 L 504,395 L 504,400 L 505,401 L 505,403 L 506,404 L 506,406 L 507,407 L 507,408 L 508,409 L 508,410 L 510,412 L 510,413 L 517,420 L 518,420 L 520,422 L 521,422 L 522,423 L 524,423 L 525,424 L 527,424 L 528,425 L 531,425 L 532,426 L 547,426 L 548,425 L 551,425 L 552,424 L 554,424 L 555,423 L 556,423 L 557,422 L 558,422 L 559,421 L 560,421 L 562,419 L 563,419 L 568,414 L 568,413 L 570,411 L 570,410 L 571,409 L 571,408 L 572,407 L 572,406 L 573,405 L 573,403 L 574,402 L 574,399 L 575,398 L 575,389 L 576,388 L 576,387 L 575,386 L 575,377 L 574,376 L 574,373 L 573,372 L 573,370 L 572,369 L 572,368 L 571,367 L 571,366 L 570,365 L 570,364 L 568,362 L 568,361 L 563,356 L 562,356 L 560,354 L 559,354 L 557,352 L 555,352 L 554,351 L 552,351 L 551,350 L 548,350 L 547,349 Z M 588,350 L 588,425 L 603,425 L 603,394 L 604,393 L 609,393 L 610,394 L 614,394 L 615,395 L 616,395 L 621,400 L 621,401 L 623,403 L 623,404 L 625,406 L 625,407 L 627,409 L 627,410 L 630,413 L 630,414 L 632,416 L 632,417 L 634,419 L 634,420 L 638,425 L 655,425 L 655,424 L 653,422 L 652,419 L 648,414 L 647,411 L 645,409 L 645,408 L 643,406 L 643,405 L 641,403 L 641,402 L 633,394 L 632,394 L 630,392 L 631,391 L 634,391 L 635,390 L 637,390 L 638,389 L 641,388 L 646,383 L 646,382 L 648,379 L 648,377 L 649,376 L 649,366 L 648,365 L 648,362 L 647,361 L 647,360 L 645,358 L 645,357 L 642,354 L 641,354 L 638,352 L 636,352 L 635,351 L 631,351 L 630,350 Z M 664,350 L 664,425 L 678,425 L 678,350 Z M 691,350 L 691,362 L 725,362 L 726,363 L 724,365 L 724,366 L 720,370 L 720,371 L 711,381 L 711,382 L 707,386 L 707,387 L 702,392 L 702,393 L 698,397 L 698,398 L 694,402 L 694,403 L 690,407 L 690,408 L 687,411 L 687,425 L 747,425 L 747,413 L 707,413 L 706,412 L 706,411 L 708,409 L 708,408 L 717,398 L 717,397 L 721,393 L 721,392 L 725,388 L 725,387 L 729,383 L 729,382 L 734,377 L 734,376 L 738,372 L 738,371 L 746,362 L 746,350 Z M 778,350 L 777,351 L 776,351 L 775,352 L 773,352 L 772,353 L 771,353 L 768,356 L 767,356 L 763,360 L 763,361 L 761,363 L 761,364 L 759,366 L 759,367 L 758,368 L 758,370 L 757,371 L 757,373 L 756,374 L 756,377 L 755,378 L 755,397 L 756,398 L 756,401 L 757,402 L 757,404 L 758,405 L 758,407 L 759,408 L 759,409 L 761,411 L 761,412 L 764,415 L 764,416 L 765,417 L 766,417 L 770,421 L 771,421 L 772,422 L 773,422 L 774,423 L 775,423 L 776,424 L 778,424 L 779,425 L 783,425 L 784,426 L 798,426 L 799,425 L 803,425 L 804,424 L 806,424 L 807,423 L 808,423 L 809,422 L 810,422 L 811,421 L 812,421 L 816,417 L 817,417 L 818,416 L 818,415 L 821,412 L 821,411 L 822,410 L 822,409 L 823,408 L 823,407 L 824,406 L 824,405 L 825,404 L 825,402 L 826,401 L 826,398 L 827,397 L 827,378 L 826,377 L 826,374 L 825,373 L 825,371 L 824,370 L 824,368 L 823,367 L 823,366 L 821,364 L 821,363 L 818,360 L 818,359 L 816,357 L 815,357 L 812,354 L 811,354 L 810,353 L 809,353 L 808,352 L 807,352 L 806,351 L 804,351 L 803,350 L 800,350 L 799,349 L 783,349 L 782,350 Z M 840,350 L 840,425 L 853,425 L 854,424 L 854,379 L 855,378 L 857,380 L 857,381 L 860,385 L 861,388 L 865,393 L 865,394 L 868,398 L 869,401 L 873,406 L 874,409 L 878,414 L 879,417 L 883,422 L 884,425 L 899,425 L 899,350 L 886,350 L 886,398 L 885,399 L 883,397 L 883,396 L 881,394 L 880,391 L 876,386 L 875,383 L 873,381 L 872,378 L 868,373 L 867,370 L 865,368 L 864,365 L 862,363 L 861,360 L 859,358 L 859,357 L 856,353 L 856,352 L 854,350 Z M 603,363 L 604,362 L 626,362 L 627,363 L 629,363 L 633,367 L 633,368 L 634,369 L 634,375 L 633,376 L 633,377 L 630,380 L 629,380 L 628,381 L 625,381 L 624,382 L 604,382 L 603,381 Z M 787,361 L 795,361 L 796,362 L 798,362 L 799,363 L 800,363 L 801,364 L 802,364 L 804,366 L 805,366 L 807,368 L 807,369 L 809,371 L 809,372 L 810,373 L 810,375 L 811,376 L 811,379 L 812,380 L 812,394 L 811,395 L 811,399 L 810,400 L 810,401 L 809,402 L 809,403 L 808,404 L 808,405 L 803,410 L 802,410 L 800,412 L 798,412 L 797,413 L 794,413 L 793,414 L 789,414 L 788,413 L 785,413 L 784,412 L 782,412 L 780,410 L 779,410 L 774,405 L 774,404 L 773,403 L 773,402 L 772,401 L 772,400 L 771,399 L 771,396 L 770,395 L 770,380 L 771,379 L 771,376 L 772,375 L 772,373 L 773,372 L 773,371 L 780,364 L 781,364 L 782,363 L 783,363 L 784,362 L 786,362 Z M 536,361 L 543,361 L 544,362 L 547,362 L 548,363 L 549,363 L 550,364 L 551,364 L 556,369 L 556,370 L 557,371 L 557,372 L 558,373 L 558,374 L 559,375 L 559,377 L 560,378 L 560,396 L 559,397 L 559,399 L 558,400 L 558,402 L 557,403 L 557,404 L 550,411 L 549,411 L 548,412 L 547,412 L 546,413 L 542,413 L 541,414 L 538,414 L 537,413 L 533,413 L 532,412 L 531,412 L 530,411 L 529,411 L 527,409 L 526,409 L 524,407 L 524,406 L 522,404 L 522,403 L 521,402 L 521,401 L 520,400 L 520,398 L 519,397 L 519,393 L 518,392 L 518,382 L 519,381 L 519,377 L 520,376 L 520,374 L 521,373 L 521,372 L 522,371 L 522,370 L 528,364 L 529,364 L 530,363 L 531,363 L 532,362 L 535,362 Z`;

export default function HorizonLogoIcon({
  size = 48,
  color = '#F59E0B',
  textColor,
  glow = false,
  variant = 'full',
  className = '',
  style = {}
}: HorizonLogoProps) {
  const primaryGold = color;
  const wordmarkColor = textColor || '#FFFFFF';

  if (variant === 'icon') {
    return (
      <span
        className={className}
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1,
          ...style
        }}
      >
        {glow && (
          <span
            style={{
              position: 'absolute',
              inset: '-20%',
              background: 'radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, transparent 70%)',
              filter: 'blur(16px)',
              borderRadius: '50%',
              pointerEvents: 'none'
            }}
          />
        )}
        <svg
          width={size}
          height={Math.round(size * 0.96)}
          viewBox="160 15 500 485"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'inline-block', verticalAlign: 'middle', overflow: 'visible' }}
        >
          {/* Outer Chevron & Base */}
          <path
            d="M 482,20 L 165,495 L 390,494 L 390,476 L 203,475 L 481,58 L 630,280 L 656,281 Z"
            fill={primaryGold}
          />
          {/* Inner Chevron & Base */}
          <path
            d="M 482,93 L 239,457 L 390,457 L 390,443 L 268,441 L 481,122 L 587,279 L 607,281 Z"
            fill={primaryGold}
          />
        </svg>
      </span>
    );
  }

  // Unified Full Lockup where the chevron's right arm hangs directly OVER the wordmark HORIZON!
  const aspectWidth = Math.round(size * 1.55);
  return (
    <span
      className={className}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1,
        ...style
      }}
    >
      {glow && (
        <span
          style={{
            position: 'absolute',
            inset: '-15%',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%)',
            filter: 'blur(20px)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }}
        />
      )}
      <svg
        width={aspectWidth}
        height={size}
        viewBox="160 15 745 485"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'inline-block', verticalAlign: 'middle', overflow: 'visible' }}
      >
        {/* Outer Chevron & Base */}
        <path
          d="M 482,20 L 165,495 L 390,494 L 390,476 L 203,475 L 481,58 L 630,280 L 656,281 Z"
          fill={primaryGold}
        />
        {/* Inner Chevron & Base */}
        <path
          d="M 482,93 L 239,457 L 390,457 L 390,443 L 268,441 L 481,122 L 587,279 L 607,281 Z"
          fill={primaryGold}
        />
        {/* Exact Overhung Wordmark HORIZON */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d={HORIZON_TEXT_PATH}
          fill={wordmarkColor}
        />
      </svg>
    </span>
  );
}



