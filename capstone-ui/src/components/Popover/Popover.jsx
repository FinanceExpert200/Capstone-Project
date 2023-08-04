import { Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverHeader, PopoverBody, Box, Flex } from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";

function ClickPopover({ word, display, color, description }) {
  return (
    <Flex align="center">
      <Box color={color} >
        {display}
      </Box>
      <Popover>
        <PopoverTrigger>
          <Box ml={2}>
            <InfoIcon boxSize={5} cursor="pointer" color={"#03314b"}/>
          </Box>
        </PopoverTrigger>
        <PopoverContent bg='white' borderColor='black'>
          <PopoverArrow />
          <PopoverHeader>
            <Box fontSize="lg" fontWeight="bold" color="black">
              {word}
            </Box>
          </PopoverHeader>
          <PopoverBody>
            <Box fontSize="md" color="black">
              {description}
            </Box>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Flex>
  );
}

export default ClickPopover;
