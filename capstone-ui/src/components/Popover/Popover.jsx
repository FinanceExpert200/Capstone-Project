import { Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverHeader, PopoverBody, Button, Box } from "@chakra-ui/react";
import "./Popover.css"
function ClickPopover({ word, display,color, description }) {
    return (
      <Popover>
        <PopoverTrigger>
          <Button variant="link" size="m" color = {color} >{display}</Button>
        </PopoverTrigger>
        <PopoverContent bg='white' borderColor='blue.500'>
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
  );
}
export default ClickPopover;