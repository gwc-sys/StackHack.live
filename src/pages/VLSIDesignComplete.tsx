import React, { useState } from "react";

interface VLSIExperiment {
  id: number;
  title: string;
  description: string;
  requirements: string[];
  theory: string;
  vhdlCode?: string;
  batchDates: {
    B1: string;
    B2: string;
    B3: string;
  };
}

const VLSIDesignComplete: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("experiments");

  // Copy to clipboard function
  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text);
    alert("Code copied to clipboard!");
  };

  // VLSI Experiments Data based on the PDF
  const vlsiExperiments: VLSIExperiment[] = [
    {
      id: 1,
      title: "4 BIT ALU",
      description: "To write VHDL Code & Test bench for 4 BIT ALU",
      requirements: [
        "Design 4-bit Arithmetic Logic Unit",
        "Implement basic operations: ADD, SUB, AND, OR, XOR",
        "Create testbench for functional verification",
        "Simulate and verify all operations"
      ],
      theory: `4-BIT ALU ARCHITECTURE:
• Inputs: Two 4-bit operands (A, B), 3-bit operation code
• Outputs: 4-bit result, flags (Zero, Carry, Overflow)
• Operations:
  - 000: ADD (A + B)
  - 001: SUBTRACT (A - B)
  - 010: AND (A & B)
  - 011: OR (A | B)
  - 100: XOR (A ^ B)
  - 101: NOT (¬A)
  - 110: INCREMENT (A + 1)
  - 111: DECREMENT (A - 1)

DESIGN APPROACH:
• Use structural or behavioral VHDL
• Implement arithmetic unit for ADD/SUB
• Implement logic unit for AND/OR/XOR
• Use multiplexer to select operation`,
      vhdlCode: `-- 4-BIT ALU VHDL Implementation
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.STD_LOGIC_UNSIGNED.ALL;
use IEEE.NUMERIC_STD.ALL;

entity ALU_4BIT is
    Port ( A : in STD_LOGIC_VECTOR (3 downto 0);
           B : in STD_LOGIC_VECTOR (3 downto 0);
           OPCODE : in STD_LOGIC_VECTOR (2 downto 0);
           RESULT : out STD_LOGIC_VECTOR (3 downto 0);
           ZERO : out STD_LOGIC;
           CARRY : out STD_LOGIC;
           OVERFLOW : out STD_LOGIC);
end ALU_4BIT;

architecture Behavioral of ALU_4BIT is
    signal temp_result : STD_LOGIC_VECTOR(4 downto 0);
    signal arith_result : STD_LOGIC_VECTOR(4 downto 0);
    signal logic_result : STD_LOGIC_VECTOR(3 downto 0);
begin
    -- Arithmetic Operations
    process(A, B, OPCODE)
    begin
        case OPCODE is
            when "000" => -- ADD
                temp_result <= ('0' & A) + ('0' & B);
            when "001" => -- SUBTRACT
                temp_result <= ('0' & A) - ('0' & B);
            when "110" => -- INCREMENT
                temp_result <= ('0' & A) + 1;
            when "111" => -- DECREMENT
                temp_result <= ('0' & A) - 1;
            when others =>
                temp_result <= (others => '0');
        end case;
    end process;

    -- Logic Operations
    process(A, B, OPCODE)
    begin
        case OPCODE is
            when "010" => -- AND
                logic_result <= A and B;
            when "011" => -- OR
                logic_result <= A or B;
            when "100" => -- XOR
                logic_result <= A xor B;
            when "101" => -- NOT
                logic_result <= not A;
            when others =>
                logic_result <= (others => '0');
        end case;
    end process;

    -- Output Selection
    process(OPCODE, temp_result, logic_result)
    begin
        if OPCODE(2) = '0' then -- Arithmetic operations
            RESULT <= temp_result(3 downto 0);
            CARRY <= temp_result(4);
            -- Overflow detection for signed arithmetic
            OVERFLOW <= (A(3) and B(3) and not temp_result(3)) or 
                       (not A(3) and not B(3) and temp_result(3));
        else -- Logic operations
            RESULT <= logic_result;
            CARRY <= '0';
            OVERFLOW <= '0';
        end if;
        
        -- Zero flag
        if (OPCODE(2) = '0' and temp_result(3 downto 0) = "0000") or
           (OPCODE(2) = '1' and logic_result = "0000") then
            ZERO <= '1';
        else
            ZERO <= '0';
        end if;
    end process;
end Behavioral;

-- TESTBENCH for 4-BIT ALU
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.STD_LOGIC_UNSIGNED.ALL;

entity TB_ALU_4BIT is
end TB_ALU_4BIT;

architecture Behavioral of TB_ALU_4BIT is
    signal A, B, RESULT : STD_LOGIC_VECTOR(3 downto 0);
    signal OPCODE : STD_LOGIC_VECTOR(2 downto 0);
    signal ZERO, CARRY, OVERFLOW : STD_LOGIC;
    
begin
    UUT: entity work.ALU_4BIT port map(A, B, OPCODE, RESULT, ZERO, CARRY, OVERFLOW);
    
    process
    begin
        -- Test ADD operation
        A <= "0101"; B <= "0011"; OPCODE <= "000";
        wait for 10 ns;
        
        -- Test SUBTRACT operation
        A <= "1000"; B <= "0011"; OPCODE <= "001";
        wait for 10 ns;
        
        -- Test AND operation
        A <= "1100"; B <= "1010"; OPCODE <= "010";
        wait for 10 ns;
        
        -- Test OR operation
        A <= "1100"; B <= "1010"; OPCODE <= "011";
        wait for 10 ns;
        
        -- Test XOR operation
        A <= "1100"; B <= "1010"; OPCODE <= "100";
        wait for 10 ns;
        
        wait;
    end process;
end Behavioral;`,
      batchDates: {
        B1: "18/7/2025",
        B2: "4/8/2025", 
        B3: "17/7/2025"
      }
    },
    {
      id: 2,
      title: "UNIVERSAL SHIFT REGISTER",
      description: "To write VHDL Code & Test bench for UNIVERSAL SHIFT REGISTER",
      requirements: [
        "Design 4-bit universal shift register",
        "Implement modes: Serial In/Out, Parallel Load, Shift Left/Right",
        "Create comprehensive testbench",
        "Verify all operational modes"
      ],
      theory: `UNIVERSAL SHIFT REGISTER:
• 4-bit bidirectional shift register with parallel load
• Control inputs determine operation mode
• Modes:
  - 00: Parallel Load
  - 01: Shift Right
  - 10: Shift Left
  - 11: Hold current state

INPUTS/OUTPUTS:
• Data Inputs: Parallel (D3-D0), Serial Left, Serial Right
• Control: Mode select (S1, S0), Clock, Reset
• Outputs: Parallel (Q3-Q0), Serial Out Left/Right

APPLICATIONS:
• Data serialization/deserialization
• Arithmetic operations
• Delay elements`,
      vhdlCode: `-- UNIVERSAL SHIFT REGISTER VHDL Implementation
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity UNIVERSAL_SHIFT_REGISTER is
    Port ( CLK : in STD_LOGIC;
           RESET : in STD_LOGIC;
           MODE : in STD_LOGIC_VECTOR (1 downto 0);
           PARALLEL_IN : in STD_LOGIC_VECTOR (3 downto 0);
           SERIAL_LEFT_IN : in STD_LOGIC;
           SERIAL_RIGHT_IN : in STD_LOGIC;
           PARALLEL_OUT : out STD_LOGIC_VECTOR (3 downto 0);
           SERIAL_LEFT_OUT : out STD_LOGIC;
           SERIAL_RIGHT_OUT : out STD_LOGIC);
end UNIVERSAL_SHIFT_REGISTER;

architecture Behavioral of UNIVERSAL_SHIFT_REGISTER is
    signal internal_reg : STD_LOGIC_VECTOR(3 downto 0);
begin
    process(CLK, RESET)
    begin
        if RESET = '1' then
            internal_reg <= "0000";
        elsif rising_edge(CLK) then
            case MODE is
                when "00" => -- Parallel Load
                    internal_reg <= PARALLEL_IN;
                when "01" => -- Shift Right
                    internal_reg <= SERIAL_RIGHT_IN & internal_reg(3 downto 1);
                when "10" => -- Shift Left
                    internal_reg <= internal_reg(2 downto 0) & SERIAL_LEFT_IN;
                when "11" => -- Hold
                    internal_reg <= internal_reg;
                when others =>
                    internal_reg <= internal_reg;
            end case;
        end if;
    end process;

    PARALLEL_OUT <= internal_reg;
    SERIAL_LEFT_OUT <= internal_reg(3);
    SERIAL_RIGHT_OUT <= internal_reg(0);
end Behavioral;`,
      batchDates: {
        B1: "5/9/2025",
        B2: "11/8/2025",
        B3: "24/7/2025"
      }
    },
    {
      id: 3,
      title: "LCD Interface",
      description: "To write VHDL code for LCD Interface",
      requirements: [
        "Interface with HD44780 compatible LCD",
        "Implement initialization sequence",
        "Create character display functions",
        "Test with multiple display patterns"
      ],
      theory: `LCD INTERFACE PROTOCOL:
• HD44780 Controller Compatibility
• 8-bit or 4-bit interface mode
• Control Signals: RS, RW, E
• Data Bus: D7-D0

INITIALIZATION SEQUENCE:
1. Power-on wait (15ms)
2. Function set command
3. Display ON/OFF control
4. Entry mode set
5. Clear display

COMMANDS:
• Clear Display: 0x01
• Return Home: 0x02
• Entry Mode Set: 0x04-0x07
• Display Control: 0x08-0x0F
• Function Set: 0x20-0x3F`,
      vhdlCode: `-- LCD INTERFACE VHDL Implementation
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.STD_LOGIC_UNSIGNED.ALL;

entity LCD_INTERFACE is
    Port ( CLK : in STD_LOGIC;
           RESET : in STD_LOGIC;
           LCD_RS : out STD_LOGIC;
           LCD_RW : out STD_LOGIC;
           LCD_E : out STD_LOGIC;
           LCD_DATA : out STD_LOGIC_VECTOR (7 downto 0);
           DATA_IN : in STD_LOGIC_VECTOR (7 downto 0);
           WRITE_ENABLE : in STD_LOGIC);
end LCD_INTERFACE;

architecture Behavioral of LCD_INTERFACE is
    type STATE_TYPE is (POWER_ON_WAIT, FUNCTION_SET, DISPLAY_ON, ENTRY_MODE, 
                       CLEAR_DISPLAY, READY, WRITE_DATA);
    signal current_state : STATE_TYPE := POWER_ON_WAIT;
    signal counter : INTEGER range 0 to 1000000 := 0;
    signal lcd_data_reg : STD_LOGIC_VECTOR(7 downto 0);
begin
    LCD_RW <= '0'; -- Always write mode

    process(CLK, RESET)
    begin
        if RESET = '1' then
            current_state <= POWER_ON_WAIT;
            counter <= 0;
            LCD_RS <= '0';
            LCD_E <= '0';
            lcd_data_reg <= (others => '0');
        elsif rising_edge(CLK) then
            case current_state is
                when POWER_ON_WAIT =>
                    if counter < 750000 then -- 15ms at 50MHz
                        counter <= counter + 1;
                    else
                        counter <= 0;
                        current_state <= FUNCTION_SET;
                    end if;
                    
                when FUNCTION_SET =>
                    LCD_RS <= '0';
                    lcd_data_reg <= "00111000"; -- 8-bit, 2 lines, 5x8 font
                    LCD_E <= '1';
                    if counter < 10 then
                        counter <= counter + 1;
                    else
                        counter <= 0;
                        LCD_E <= '0';
                        current_state <= DISPLAY_ON;
                    end if;
                    
                when DISPLAY_ON =>
                    LCD_RS <= '0';
                    lcd_data_reg <= "00001100"; -- Display ON, cursor OFF
                    LCD_E <= '1';
                    if counter < 10 then
                        counter <= counter + 1;
                    else
                        counter <= 0;
                        LCD_E <= '0';
                        current_state <= ENTRY_MODE;
                    end if;
                    
                when ENTRY_MODE =>
                    LCD_RS <= '0';
                    lcd_data_reg <= "00000110"; -- Increment cursor, no shift
                    LCD_E <= '1';
                    if counter < 10 then
                        counter <= counter + 1;
                    else
                        counter <= 0;
                        LCD_E <= '0';
                        current_state <= CLEAR_DISPLAY;
                    end if;
                    
                when CLEAR_DISPLAY =>
                    LCD_RS <= '0';
                    lcd_data_reg <= "00000001"; -- Clear display
                    LCD_E <= '1';
                    if counter < 10 then
                        counter <= counter + 1;
                    else
                        counter <= 0;
                        LCD_E <= '0';
                        current_state <= READY;
                    end if;
                    
                when READY =>
                    if WRITE_ENABLE = '1' then
                        current_state <= WRITE_DATA;
                    end if;
                    
                when WRITE_DATA =>
                    LCD_RS <= '1'; -- Data mode
                    lcd_data_reg <= DATA_IN;
                    LCD_E <= '1';
                    if counter < 10 then
                        counter <= counter + 1;
                    else
                        counter <= 0;
                        LCD_E <= '0';
                        current_state <= READY;
                    end if;
            end case;
        end if;
    end process;

    LCD_DATA <= lcd_data_reg;
end Behavioral;`,
      batchDates: {
        B1: "27/10/2025",
        B2: "3/11/2025",
        B3: "3/11/2025"
      }
    },
    {
      id: 4,
      title: "Buffer Implementation",
      description: "To Design & Implement Buffer using VHDL Code",
      requirements: [
        "Design various types of buffers",
        "Implement tri-state buffer",
        "Create bidirectional buffer",
        "Test buffer functionality"
      ],
      theory: `BUFFER TYPES AND APPLICATIONS:
• Simple Buffer: Signal amplification, isolation
• Tri-state Buffer: Bus interfacing, output enable control
• Bidirectional Buffer: Data bus applications

TRI-STATE BUFFER:
• Output Enable (OE) control
• High impedance state when disabled
• Essential for bus architectures

BIDIRECTIONAL BUFFER:
• Direction control signal
• Shared data bus capability
• Used in microprocessor interfaces`,
      vhdlCode: `-- BUFFER IMPLEMENTATIONS in VHDL
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

-- Simple Buffer
entity SIMPLE_BUFFER is
    Port ( A : in STD_LOGIC;
           Y : out STD_LOGIC);
end SIMPLE_BUFFER;

architecture Behavioral of SIMPLE_BUFFER is
begin
    Y <= A;
end Behavioral;

-- Tri-State Buffer
entity TRISTATE_BUFFER is
    Port ( A : in STD_LOGIC;
           OE : in STD_LOGIC; -- Output Enable
           Y : out STD_LOGIC);
end TRISTATE_BUFFER;

architecture Behavioral of TRISTATE_BUFFER is
begin
    Y <= A when OE = '1' else 'Z';
end Behavioral;

-- Bidirectional Buffer
entity BIDIRECTIONAL_BUFFER is
    Port ( A : inout STD_LOGIC;
           B : inout STD_LOGIC;
           DIR : in STD_LOGIC; -- Direction: 0=A->B, 1=B->A
           OE : in STD_LOGIC); -- Output Enable
end BIDIRECTIONAL_BUFFER;

architecture Behavioral of BIDIRECTIONAL_BUFFER is
begin
    process(A, B, DIR, OE)
    begin
        if OE = '1' then
            if DIR = '0' then
                B <= A;
                A <= 'Z';
            else
                A <= B;
                B <= 'Z';
            end if;
        else
            A <= 'Z';
            B <= 'Z';
        end if;
    end process;
end Behavioral;`,
      batchDates: {
        B1: "10/10/2025",
        B2: "13/10/2025", 
        B3: "16/10/2025"
      }
    },
    {
      id: 5,
      title: "4:1 Multiplexer",
      description: "To write VHDL Code & Test bench for 4:1 Multiplexer",
      requirements: [
        "Design 4:1 multiplexer using different styles",
        "Implement using case statement, when-else, with-select",
        "Create comprehensive testbench",
        "Verify all input combinations"
      ],
      theory: `4:1 MULTIPLEXER:
• 4 data inputs (I0-I3)
• 2 select lines (S1, S0)
• 1 output (Y)

TRUTH TABLE:
S1 S0 | Y
------|--
0  0  | I0
0  1  | I1
1  0  | I2
1  1  | I3

VHDL IMPLEMENTATION STYLES:
1. Using WHEN-ELSE (Dataflow)
2. Using WITH-SELECT (Dataflow) 
3. Using CASE statement (Behavioral)
4. Using structural components

APPLICATIONS:
• Data routing
• Function generators
• ALU operations`,
      vhdlCode: `-- 4:1 MULTIPLEXER VHDL Implementations
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

-- Method 1: Using WHEN-ELSE
entity MUX4x1_WHEN is
    Port ( I : in STD_LOGIC_VECTOR (3 downto 0);
           S : in STD_LOGIC_VECTOR (1 downto 0);
           Y : out STD_LOGIC);
end MUX4x1_WHEN;

architecture Dataflow of MUX4x1_WHEN is
begin
    Y <= I(0) when S = "00" else
         I(1) when S = "01" else
         I(2) when S = "10" else
         I(3);
end Dataflow;

-- Method 2: Using WITH-SELECT
entity MUX4x1_WITH is
    Port ( I : in STD_LOGIC_VECTOR (3 downto 0);
           S : in STD_LOGIC_VECTOR (1 downto 0);
           Y : out STD_LOGIC);
end MUX4x1_WITH;

architecture Dataflow of MUX4x1_WITH is
begin
    with S select
        Y <= I(0) when "00",
             I(1) when "01",
             I(2) when "10",
             I(3) when others;
end Dataflow;

-- Method 3: Using CASE statement
entity MUX4x1_CASE is
    Port ( I : in STD_LOGIC_VECTOR (3 downto 0);
           S : in STD_LOGIC_VECTOR (1 downto 0);
           Y : out STD_LOGIC);
end MUX4x1_CASE;

architecture Behavioral of MUX4x1_CASE is
begin
    process(I, S)
    begin
        case S is
            when "00" => Y <= I(0);
            when "01" => Y <= I(1);
            when "10" => Y <= I(2);
            when others => Y <= I(3);
        end case;
    end process;
end Behavioral;

-- TESTBENCH for 4:1 Multiplexer
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity TB_MUX4x1 is
end TB_MUX4x1;

architecture Behavioral of TB_MUX4x1 is
    signal I : STD_LOGIC_VECTOR(3 downto 0);
    signal S : STD_LOGIC_VECTOR(1 downto 0);
    signal Y1, Y2, Y3 : STD_LOGIC;
begin
    -- Instantiate all three implementations
    U1: entity work.MUX4x1_WHEN port map(I, S, Y1);
    U2: entity work.MUX4x1_WITH port map(I, S, Y2);
    U3: entity work.MUX4x1_CASE port map(I, S, Y3);
    
    process
    begin
        -- Test all input combinations
        for sel in 0 to 3 loop
            S <= STD_LOGIC_VECTOR(to_unsigned(sel, 2));
            I <= "0001"; wait for 10 ns;
            I <= "0010"; wait for 10 ns;
            I <= "0100"; wait for 10 ns;
            I <= "1000"; wait for 10 ns;
        end loop;
        wait;
    end process;
end Behavioral;`,
      batchDates: {
        B1: "25/7/2025",
        B2: "21/07/2025",
        B3: "24/7/2025"
      }
    },
    {
      id: 6,
      title: "CMOS Layout - Basic Gates",
      description: "To prepare CMOS layout for CMOS Inverter, NAND, NOR Gate",
      requirements: [
        "Design CMOS inverter layout",
        "Create NAND gate layout", 
        "Implement NOR gate layout",
        "Follow design rules and optimize area"
      ],
      theory: `CMOS LAYOUT FUNDAMENTALS:
• PMOS transistors in N-well
• NMOS transistors in P-substrate
• Design Rules: Minimum width, spacing, enclosure
• Stick Diagrams → Mask Layout

CMOS INVERTER:
• PMOS pull-up network
• NMOS pull-down network
• VDD and GND routing

NAND GATE:
• 2 PMOS in parallel (pull-up)
• 2 NMOS in series (pull-down)

NOR GATE:
• 2 PMOS in series (pull-up)
• 2 NMOS in parallel (pull-down)

LAYOUT CONSIDERATIONS:
• Minimum feature size
• Well and substrate contacts
• Metal routing layers
• Contact and via placement`,
      vhdlCode: undefined,
      batchDates: {
        B1: "8/8/2025",
        B2: "1/9/2025",
        B3: "14/8/2025"
      }
    },
    {
      id: 7,
      title: "CMOS Layout - 2:1 Multiplexer",
      description: "To prepare CMOS layout for 2:1 Multiplexer",
      requirements: [
        "Design 2:1 multiplexer using transmission gates",
        "Create CMOS implementation",
        "Optimize layout area",
        "Verify functionality"
      ],
      theory: `2:1 MULTIPLEXER IMPLEMENTATIONS:
1. Transmission Gate Based:
   • Uses 2 transmission gates
   • Select signal controls TG operation
   • Efficient and compact

2. Logic Gate Based:
   • Uses AND-OR logic
   • Standard CMOS implementation

TRANSMISSION GATE MUX:
Y = (S' • I0) + (S • I1)

CMOS IMPLEMENTATION:
• 4 transistors for TG implementation
• Inverter for select signal generation
• Total 6 transistors

LAYOUT STRATEGY:
• Common centroid layout for matching
• Shared diffusion areas
• Optimized metal routing`,
      vhdlCode: undefined,
      batchDates: {
        B1: "26/09/2025",
        B2: "22/09/2025",
        B3: "4/09/2025"
      }
    },
    {
      id: 8,
      title: "CMOS Layout - Adders",
      description: "To prepare CMOS layout for Half Adder & Full Adder",
      requirements: [
        "Design half adder using CMOS",
        "Implement full adder circuit",
        "Create optimized layout",
        "Verify sum and carry outputs"
      ],
      theory: `ADDER CIRCUITS:

HALF ADDER:
• Sum = A ⊕ B
• Carry = A • B
• 2 inputs, 2 outputs

FULL ADDER:
• Sum = A ⊕ B ⊕ Cin
• Carry = A•B + B•Cin + Cin•A
• 3 inputs, 2 outputs

CMOS IMPLEMENTATION:
• XOR gates for sum calculation
• Majority function for carry
• Can use transmission gates for efficient XOR

LAYOUT APPROACH:
• Mirror circuits for similar structures
• Shared power and ground lines
• Compact cell design
• Regular placement of transistors`,
      vhdlCode: undefined,
      batchDates: {
        B1: "12/09/2025",
        B2: "15/09/2025",
        B3: "28/08/2025"
      }
    }
  ];

  // Navigation items
  const navigationItems: { id: string; label: string; color: string }[] = [
    { id: "experiments", label: "🔬 All Experiments", color: "blue" },
    { id: "vhdl", label: "💻 VHDL Programs", color: "green" },
    { id: "schedule", label: "📅 Batch Schedule", color: "purple" },
    { id: "theory", label: "📚 VLSI Theory", color: "orange" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🔌 VLSI Design & Technology Laboratory
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            KJ College of Engineering & Management Research, Pune - Department of E&TC
          </p>
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 max-w-2xl mx-auto">
            <p className="text-yellow-800 font-semibold">
              📢 Notice: Complete all experiments before 3/11/2025. Submission will not be considered after this date.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`px-6 py-3 rounded-xl font-bold text-white transition-all transform hover:scale-105 ${
                activeSection === item.id 
                  ? `bg-${item.color}-600 shadow-lg` 
                  : `bg-${item.color}-400 hover:bg-${item.color}-500`
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Experiments Section */}
        {activeSection === "experiments" && (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-4xl font-bold text-blue-700 mb-8 text-center">
              🔬 All VLSI Experiments
            </h2>
            <div className="space-y-8">
              {vlsiExperiments.map((exp) => (
                <div key={exp.id} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <h3 className="text-2xl font-bold text-blue-800">
                      Experiment {exp.id}: {exp.title}
                    </h3>
                    <div className="flex gap-4 mt-2 lg:mt-0">
                      <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                        B1: {exp.batchDates.B1}
                      </span>
                      <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        B2: {exp.batchDates.B2}
                      </span>
                      <span className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                        B3: {exp.batchDates.B3}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{exp.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-blue-700 mb-2">Requirements:</h4>
                    <ul className="list-disc ml-6 text-gray-600">
                      {exp.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-700 mb-2">Theory & Implementation:</h4>
                    <p className="text-green-800 whitespace-pre-line">{exp.theory}</p>
                  </div>

                  {exp.vhdlCode && (
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-gray-700">VHDL Code:</h4>
                        <button
                          onClick={() => copyToClipboard(exp.vhdlCode!)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          📋 Copy Code
                        </button>
                      </div>
                      <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                        <pre className="text-green-400 text-sm leading-relaxed">
                          <code>{exp.vhdlCode}</code>
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VHDL Programs Section */}
        {activeSection === "vhdl" && (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-4xl font-bold text-green-700 mb-8 text-center">
              💻 VHDL Programs (1-5)
            </h2>
            <div className="space-y-8">
              {vlsiExperiments.filter(exp => exp.vhdlCode).map((exp) => (
                <div key={exp.id} className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <h3 className="text-2xl font-bold text-green-800 mb-2 lg:mb-0">
                      Program {exp.id}: {exp.title}
                    </h3>
                    <button
                      onClick={() => copyToClipboard(exp.vhdlCode!)}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-semibold transition-colors"
                    >
                      📋 Copy VHDL Code
                    </button>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{exp.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-green-700 mb-2">Requirements:</h4>
                    <ul className="list-disc ml-6 text-gray-600">
                      {exp.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                    <pre className="text-green-400 text-sm leading-relaxed">
                      <code>{exp.vhdlCode}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Batch Schedule Section */}
        {activeSection === "schedule" && (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-4xl font-bold text-purple-700 mb-8 text-center">
              📅 Batch-wise Schedule
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-lg">
                <thead className="bg-purple-600 text-white">
                  <tr>
                    <th className="p-4 text-left">Sr.No.</th>
                    <th className="p-4 text-left">Experiment</th>
                    <th className="p-4 text-center">B1 Batch Dates</th>
                    <th className="p-4 text-center">B2 Batch Dates</th>
                    <th className="p-4 text-center">B3 Batch Dates</th>
                  </tr>
                </thead>
                <tbody>
                  {vlsiExperiments.map((exp) => (
                    <tr key={exp.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-4 font-semibold">{exp.id}</td>
                      <td className="p-4">{exp.title}</td>
                      <td className="p-4 text-center bg-blue-50 text-blue-700 font-semibold">
                        {exp.batchDates.B1}
                      </td>
                      <td className="p-4 text-center bg-green-50 text-green-700 font-semibold">
                        {exp.batchDates.B2}
                      </td>
                      <td className="p-4 text-center bg-purple-50 text-purple-700 font-semibold">
                        {exp.batchDates.B3}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-yellow-800 mb-4">📢 Important Dates</h3>
              <ul className="space-y-2 text-yellow-700">
                <li>• <strong>Final Submission Deadline:</strong> 3rd November 2025</li>
                <li>• <strong>Practice/Mock Sessions:</strong> 3rd, 4th, or 5th November 2025</li>
                <li>• <strong>Lab Availability:</strong> As per college schedule</li>
                <li>• <strong>Attendance & Marks:</strong> Complete assignments and get entries in attendance muster</li>
              </ul>
            </div>
          </div>
        )}

        {/* Theory Section */}
        {activeSection === "theory" && (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-4xl font-bold text-orange-700 mb-8 text-center">
              📚 VLSI Design Theory
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* VHDL Theory */}
              <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-4">💻 VHDL Programming</h3>
                <ul className="space-y-2 text-blue-700">
                  <li><strong>Entity:</strong> Interface definition</li>
                  <li><strong>Architecture:</strong> Implementation</li>
                  <li><strong>Data Types:</strong> STD_LOGIC, STD_LOGIC_VECTOR</li>
                  <li><strong>Modeling Styles:</strong> Behavioral, Dataflow, Structural</li>
                  <li><strong>Testbenches:</strong> Verification and simulation</li>
                </ul>
              </div>

              {/* CMOS Theory */}
              <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                <h3 className="text-xl font-bold text-green-800 mb-4">🔌 CMOS Technology</h3>
                <ul className="space-y-2 text-green-700">
                  <li><strong>PMOS/NMOS:</strong> Complementary pairs</li>
                  <li><strong>Pull-up/Pull-down:</strong> Network design</li>
                  <li><strong>Power Consumption:</strong> Static vs Dynamic</li>
                  <li><strong>Scaling:</strong> Moore's Law implications</li>
                  <li><strong>Fabrication:</strong> CMOS process flow</li>
                </ul>
              </div>

              {/* Layout Theory */}
              <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
                <h3 className="text-xl font-bold text-purple-800 mb-4">📐 Layout Design</h3>
                <ul className="space-y-2 text-purple-700">
                  <li><strong>Design Rules:</strong> Minimum feature sizes</li>
                  <li><strong>Stick Diagrams:</strong> Schematic to layout</li>
                  <li><strong>Mask Layers:</strong> Diffusion, Poly, Metal</li>
                  <li><strong>DRC/LVS:</strong> Design rule checking</li>
                  <li><strong>Area Optimization:</strong> Compact layout</li>
                </ul>
              </div>

              {/* Digital Design Theory */}
              <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
                <h3 className="text-xl font-bold text-red-800 mb-4">🔢 Digital Circuits</h3>
                <ul className="space-y-2 text-red-700">
                  <li><strong>Combinational:</strong> Gates, MUX, ALU</li>
                  <li><strong>Sequential:</strong> Flip-flops, Registers</li>
                  <li><strong>FSM:</strong> Finite State Machines</li>
                  <li><strong>Timing:</strong> Setup/hold time, Clock skew</li>
                  <li><strong>Testing:</strong> Fault models, ATPG</li>
                </ul>
              </div>

              {/* Tools Theory */}
              <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200">
                <h3 className="text-xl font-bold text-yellow-800 mb-4">🛠️ EDA Tools</h3>
                <ul className="space-y-2 text-yellow-700">
                  <li><strong>Simulation:</strong> ModelSim, VCS</li>
                  <li><strong>Synthesis:</strong> Design Compiler</li>
                  <li><strong>Layout:</strong> Cadence Virtuoso</li>
                  <li><strong>Verification:</strong> Formal, Timing</li>
                  <li><strong>MicroWind:</strong> Layout design tool</li>
                </ul>
              </div>

              {/* Applications Theory */}
              <div className="bg-indigo-50 rounded-xl p-6 border-2 border-indigo-200">
                <h3 className="text-xl font-bold text-indigo-800 mb-4">🚀 Applications</h3>
                <ul className="space-y-2 text-indigo-700">
                  <li><strong>Processors:</strong> CPU, GPU design</li>
                  <li><strong>Memory:</strong> SRAM, DRAM, Flash</li>
                  <li><strong>ASIC:</strong> Application specific ICs</li>
                  <li><strong>FPGA:</strong> Field programmable gate arrays</li>
                  <li><strong>IoT:</strong> Low power devices</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-gray-600 mt-12 pt-8 border-t border-gray-300">
          <p className="text-sm mt-1">Subject: VLSI Design & Technology</p>
          <p className="text-sm mt-4 font-semibold">Develop By MR </p>
        </footer>
      </div>
    </div>
  );
};

export default VLSIDesignComplete;