import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const ImageCard = ({ card, onClick }) => (
  <div className="relative overflow-hidden h-24 w-24 sm:h-24 sm:w-24 md:h-56 md:w-56 lg:h-72 lg:w-72">
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative cursor-pointer h-full w-full"
      onClick={onClick}
    >
      <Image
        src={card.thumbnail}
        alt="thumbnail"
        fill
        className="object-cover object-center"
      />
    </motion.div>
  </div>
);

export default ImageCard;
