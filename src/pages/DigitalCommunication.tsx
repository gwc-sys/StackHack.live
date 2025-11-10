import React, { useState } from "react";

interface PracticalExperiment {
  id: number;
  title: string;
  description: string;
  requirements: string[];
  theory: string;
  example?: string;
  matlabCode: string | null;
}

const CommunicationSystemsComplete: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("practicals");

  // Copy to clipboard function
  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text);
    alert("Code copied to clipboard!");
  };

  // All 17 Practical Experiments Data
  const practicalExperiments: PracticalExperiment[] = [
    {
      id: 1,
      title: "BPSK Transmitter & Receiver",
      description: "Study of BPSK transmitter & receiver using suitable hardware setup/kit.",
      requirements: [
        "Draw Block Diagram of Transmitter and Receiver",
        "Draw related waveforms"
      ],
      theory: `BPSK (Binary Phase Shift Keying) uses two phase states:
• Binary 1: Carrier phase = 0°
• Binary 0: Carrier phase = 180°

TRANSMITTER BLOCK DIAGRAM:
Data Source → Encoder → Balanced Modulator → Carrier Oscillator → BPSK Output

RECEIVER BLOCK DIAGRAM:
BPSK Input → Bandpass Filter → Product Detector → Low Pass Filter → Decision Circuit → Data Output

WAVEFORMS:
• Input Data: Square wave (0s and 1s)
• Carrier: Sine wave
• BPSK Output: Phase shifts of 180° for data transitions`,
      matlabCode: null
    },
    {
      id: 2,
      title: "BPSK Transmitter & Receiver - Implementation",
      description: "Study of BPSK transmitter & receiver using suitable hardware setup/kit.",
      requirements: [
        "Draw Block Diagram of Transmitter and Receiver",
        "Draw related waveforms"
      ],
      theory: `HARDWARE COMPONENTS:
• Function Generator (Carrier)
• Data Source (Pattern Generator)
• Balanced Modulator
• Bandpass Filter
• Phase Detector

EXPERIMENTAL SETUP:
1. Generate carrier signal (e.g., 1 MHz)
2. Generate binary data stream
3. Modulate using balanced modulator
4. Observe phase shifts on oscilloscope
5. Demodulate using coherent detection`,
      matlabCode: null
    },
    {
      id: 3,
      title: "QPSK Transmitter & Receiver",
      description: "Study of QPSK transmitter & receiver using suitable hardware setup/kit.",
      requirements: [
        "Draw Block Diagram of Transmitter and Receiver",
        "Draw related waveforms"
      ],
      theory: `QPSK (Quadrature Phase Shift Keying) uses 4 phase states:
• 00: 45°, 01: 135°, 11: 225°, 10: 315°

TRANSMITTER BLOCK DIAGRAM:
Data → Serial-to-Parallel → I-Channel Modulator → Q-Channel Modulator → 90° Phase Shifter → Carrier → Summer → QPSK Output

RECEIVER BLOCK DIAGRAM:
QPSK Input → I-Channel Demodulator → Q-Channel Demodulator → Low Pass Filters → Decision Circuits → Parallel-to-Serial → Data Output

WAVEFORMS:
• I-channel and Q-channel waveforms
• Four different phase states visible on constellation`,
      matlabCode: null
    },
    {
      id: 4,
      title: "QPSK Implementation",
      description: "Study of QPSK transmitter & receiver using suitable hardware setup/kit.",
      requirements: [
        "Draw Block Diagram of Transmitter and Receiver",
        "Draw related waveforms"
      ],
      theory: `HARDWARE REQUIREMENTS:
• Two balanced modulators
• 90° phase shifter
• Summer circuit
• Quadrature demodulator

MEASUREMENTS:
• Symbol rate = 1/2 bit rate
• Bandwidth efficiency compared to BPSK
• Constellation diagram points`,
      matlabCode: null
    },
    {
      id: 5,
      title: "FSK with Noise Analysis",
      description: "To study Generation and reception of FSK in presence of noise using suitable hardware set up/kit.",
      requirements: [
        "Draw Block Diagram of Transmitter and Receiver",
        "Draw related waveforms"
      ],
      theory: `FSK (Frequency Shift Keying):
• Binary 1: Frequency f1
• Binary 0: Frequency f2

TRANSMITTER BLOCK DIAGRAM:
Data → Voltage Controlled Oscillator (VCO) → FSK Output

RECEIVER BLOCK DIAGRAM:
FSK Input → Two Bandpass Filters (f1 & f2) → Envelope Detectors → Comparator → Data Output

NOISE ANALYSIS:
• Add white Gaussian noise
• Observe BER degradation
• Compare with theoretical performance`,
      matlabCode: null
    },
    {
      id: 6,
      title: "DSSS Modulation & Demodulation",
      description: "To study Direct Sequence Spread Spectrum Modulation and Demodulation.",
      requirements: [
        "Draw Block Diagram of Transmitter and Receiver",
        "Draw related waveforms"
      ],
      theory: `DSSS (Direct Sequence Spread Spectrum):
• Spreads signal using PN code
• Processing Gain = Chip Rate / Data Rate

TRANSMITTER BLOCK DIAGRAM:
Data → XOR with PN Code → BPSK Modulator → DSSS Signal

RECEIVER BLOCK DIAGRAM:
DSSS Signal → BPSK Demodulator → XOR with PN Code → Low Pass Filter → Data Output

ADVANTAGES:
• Interference rejection
• Security through spreading
• Multipath immunity`,
      matlabCode: null
    },
    {
      id: 7,
      title: "BPSK BER Performance Simulation",
      description: "Write a MATLAB code & simulate the Performance of BPSK receiver in presence of noise.",
      requirements: [
        "Calculate BER of BPSK with different values of SNR",
        "Compare the simulation result of BER with theoretical value"
      ],
      theory: `THEORETICAL BACKGROUND:
• BER for BPSK in AWGN: 0.5 * erfc(sqrt(SNR))
• Monte Carlo simulation approach
• Importance of large sample size for accurate results`,
      matlabCode: `% BPSK BER Simulation in AWGN Channel
clear all; close all; clc;

% Simulation Parameters
N = 100000;                    % Number of bits
SNR_dB = 0:2:10;              % SNR range in dB
num_SNR = length(SNR_dB);
theory_BER = zeros(1, num_SNR);
sim_BER = zeros(1, num_SNR);

fprintf('BPSK BER Simulation\\n');
fprintf('====================\\n');

for snr_idx = 1:num_SNR
    SNR = 10^(SNR_dB(snr_idx)/10);    % Convert to linear
    theory_BER(snr_idx) = 0.5 * erfc(sqrt(SNR));
    
    % Generate random binary data
    data_bits = randi([0 1], 1, N);
    
    % BPSK Modulation: 0 -> -1, 1 -> +1
    bpsk_signal = 2 * data_bits - 1;
    
    % Add AWGN
    noise_power = 1 / (2 * SNR);
    noise = sqrt(noise_power) * randn(1, N);
    received_signal = bpsk_signal + noise;
    
    % Demodulation: Decision at 0
    decoded_bits = received_signal > 0;
    
    % Calculate Bit Error Rate
    error_count = sum(data_bits ~= decoded_bits);
    sim_BER(snr_idx) = error_count / N;
    
    fprintf('SNR: %2d dB, Theoretical BER: %.2e, Simulated BER: %.2e\\n', ...
            SNR_dB(snr_idx), theory_BER(snr_idx), sim_BER(snr_idx));
end

% Plot Results
figure('Position', [100, 100, 800, 600]);
semilogy(SNR_dB, theory_BER, 'b-', 'LineWidth', 2, 'DisplayName', 'Theoretical');
hold on;
semilogy(SNR_dB, sim_BER, 'ro--', 'LineWidth', 2, 'MarkerSize', 8, 'DisplayName', 'Simulated');
grid on;
xlabel('SNR (dB)', 'FontSize', 12);
ylabel('Bit Error Rate (BER)', 'FontSize', 12);
title('BPSK BER Performance in AWGN Channel', 'FontSize', 14);
legend('Location', 'southwest', 'FontSize', 10);
axis([0 10 1e-6 1]);
set(gca, 'FontSize', 10);`
    },
    {
      id: 8,
      title: "BPSK BER Analysis - Extended",
      description: "Write a MATLAB code & simulate the Performance of BPSK receiver in presence of noise.",
      requirements: [
        "Calculate BER of BPSK with different values of SNR",
        "Compare the simulation result of BER with theoretical value"
      ],
      theory: `EXTENDED ANALYSIS:
• Multiple simulation runs for confidence
• Error bar calculation
• Runtime performance optimization`,
      matlabCode: `% Extended BPSK BER Simulation with Multiple Runs
clear all; close all; clc;

% Enhanced Simulation Parameters
N = 50000;                     % Bits per simulation
num_runs = 5;                  % Number of Monte Carlo runs
SNR_dB = 0:1:12;              % Denser SNR range
num_SNR = length(SNR_dB);

% Initialize results
theory_BER = zeros(1, num_SNR);
avg_sim_BER = zeros(1, num_SNR);
std_sim_BER = zeros(1, num_SNR);

fprintf('Enhanced BPSK BER Simulation with %d runs\\n', num_runs);
fprintf('=========================================\\n');

for snr_idx = 1:num_SNR
    SNR_linear = 10^(SNR_dB(snr_idx)/10);
    theory_BER(snr_idx) = 0.5 * erfc(sqrt(SNR_linear));
    
    run_BER = zeros(1, num_runs);
    
    for run = 1:num_runs
        % Data generation and modulation
        data = randi([0 1], 1, N);
        modulated = 2 * data - 1;
        
        % AWGN channel
        noise_std = 1 / sqrt(2 * SNR_linear);
        received = modulated + noise_std * randn(1, N);
        
        % Demodulation
        decoded = received > 0;
        run_BER(run) = sum(data ~= decoded) / N;
    end
    
    avg_sim_BER(snr_idx) = mean(run_BER);
    std_sim_BER(snr_idx) = std(run_BER);
    
    fprintf('SNR: %2d dB | Theory: %.3e | Sim: %.3e ± %.3e\\n', ...
            SNR_dB(snr_idx), theory_BER(snr_idx), avg_sim_BER(snr_idx), std_sim_BER(snr_idx));
end

% Enhanced Plotting
figure('Position', [100, 100, 900, 700]);
errorbar(SNR_dB, avg_sim_BER, std_sim_BER, 'ro--', 'LineWidth', 2, ...
         'MarkerSize', 6, 'CapSize', 10, 'DisplayName', 'Simulated BER');
hold on;
semilogy(SNR_dB, theory_BER, 'b-', 'LineWidth', 3, 'DisplayName', 'Theoretical BER');
grid on;
xlabel('SNR (dB)', 'FontSize', 14, 'FontWeight', 'bold');
ylabel('Bit Error Rate', 'FontSize', 14, 'FontWeight', 'bold');
title('BPSK BER Performance with Error Bars', 'FontSize', 16, 'FontWeight', 'bold');
legend('FontSize', 12);
axis([0 12 1e-7 1]);
set(gca, 'FontSize', 12, 'YScale', 'log');`
    },
    {
      id: 9,
      title: "Huffman Coding Implementation",
      description: "Write a MATLAB code to design Huffman Codes and Evaluate Coding efficiency.",
      example: "A zero-memory source emits four messages (x1, x2, x3, x4) with probabilities (0.3, 0.2, 0.4, 0.1) respectively.",
      requirements: [
        "Find Huffman code",
        "Determine average word length", 
        "Find entropy of the source",
        "Determine efficiency and redundancy"
      ],
      theory: `HUFFMAN CODING PRINCIPLES:
• Variable-length prefix coding
• More probable symbols get shorter codes
• Optimal for given probability distribution

PERFORMANCE METRICS:
• Entropy: H = -Σ p_i log₂(p_i)
• Average code length: L = Σ p_i l_i
• Efficiency: η = (H/L) × 100%
• Redundancy: R = 1 - η`,
      matlabCode: `% Huffman Coding Implementation with Complete Analysis
function huffman_coding_complete()
    % Example: Four messages with given probabilities
    symbols = {'x1', 'x2', 'x3', 'x4'};
    probabilities = [0.3, 0.2, 0.4, 0.1];
    
    fprintf('Huffman Coding Analysis\\n');
    fprintf('=======================\\n');
    fprintf('Symbols:    '); fprintf('%s   ', symbols{:}); fprintf('\\n');
    fprintf('Probabilities: '); fprintf('%.2f  ', probabilities); fprintf('\\n\\n');
    
    % Sort probabilities in descending order
    [prob_sorted, idx] = sort(probabilities, 'descend');
    sym_sorted = symbols(idx);
    
    % Initialize codes
    codes = cell(size(symbols));
    for i = 1:length(codes)
        codes{i} = '';
    end
    
    % Display initial sorted probabilities
    fprintf('Initial sorted probabilities:\\n');
    for i = 1:length(prob_sorted)
        fprintf('  %s: %.2f\\n', sym_sorted{i}, prob_sorted(i));
    end
    fprintf('\\n');
    
    % Huffman coding algorithm
    step = 1;
    while length(prob_sorted) > 1
        fprintf('Step %d:\\n', step);
        fprintf('  Combining: %s (%.2f) and %s (%.2f)\\n', ...
                sym_sorted{end-1}, prob_sorted(end-1), ...
                sym_sorted{end}, prob_sorted(end));
        
        % Update codes for the two combined symbols
        for i = 1:length(codes)
            if strcmp(sym_sorted{end}, symbols{i})
                codes{i} = ['1' codes{i}];
                fprintf('    %s -> 1 (code: %s)\\n', symbols{i}, codes{i});
            elseif strcmp(sym_sorted{end-1}, symbols{i})
                codes{i} = ['0' codes{i}];
                fprintf('    %s -> 0 (code: %s)\\n', symbols{i}, codes{i});
            end
        end
        
        % Combine probabilities
        new_prob = prob_sorted(end-1) + prob_sorted(end);
        new_sym = [sym_sorted{end-1} '+' sym_sorted{end}];
        
        % Remove last two and add new combined probability
        prob_sorted = [prob_sorted(1:end-2), new_prob];
        sym_sorted = [sym_sorted(1:end-2), {new_sym}];
        
        % Re-sort in descending order
        [prob_sorted, sort_idx] = sort(prob_sorted, 'descend');
        sym_sorted = sym_sorted(sort_idx);
        
        step = step + 1;
        fprintf('\\n');
    end
    
    % Display final Huffman codes
    fprintf('Final Huffman Codes:\\n');
    fprintf('====================\\n');
    for i = 1:length(symbols)
        fprintf('  %s: %s\\n', symbols{i}, codes{i});
    end
    fprintf('\\n');
    
    % Calculate average word length
    avg_length = 0;
    for i = 1:length(probabilities)
        avg_length = avg_length + probabilities(i) * length(codes{i});
    end
    fprintf('Average Code Length: %.4f bits/symbol\\n', avg_length);
    
    % Calculate entropy
    entropy = 0;
    for i = 1:length(probabilities)
        if probabilities(i) > 0
            entropy = entropy - probabilities(i) * log2(probabilities(i));
        end
    end
    fprintf('Source Entropy: %.4f bits/symbol\\n', entropy);
    
    % Calculate efficiency and redundancy
    efficiency = (entropy / avg_length) * 100;
    redundancy = 100 - efficiency;
    fprintf('Coding Efficiency: %.2f%%\\n', efficiency);
    fprintf('Redundancy: %.2f%%\\n', redundancy);
    
    % Additional metrics
    fprintf('\\nAdditional Metrics:\\n');
    fprintf('====================\\n');
    fprintf('Compression Ratio: %.3f\\n', entropy/avg_length);
    fprintf('Bits Saved: %.2f%%\\n', (1 - avg_length/2) * 100); % Compared to fixed 2-bit coding
    
    % Display code tree structure
    fprintf('\\nCode Tree Structure:\\n');
    fprintf('=====================\\n');
    for i = 1:length(symbols)
        fprintf('  %s (p=%.2f) -> %s (length: %d)\\n', ...
                symbols{i}, probabilities(i), codes{i}, length(codes{i}));
    end
end

% Run the function
huffman_coding_complete();`
    },
    {
      id: 10,
      title: "Huffman Coding - Extended Example",
      description: "Write a MATLAB code to design Huffman Codes and Evaluate Coding efficiency.",
      example: "A zero-memory source emits four messages (x1, x2, x3, x4) with probabilities (0.3, 0.2, 0.4, 0.1) respectively.",
      requirements: [
        "Find Codewords",
        "Determine average word length", 
        "Find entropy of the source",
        "Determine efficiency and redundancy"
      ],
      theory: `COMPARISON WITH OTHER CODES:
• Fixed-length coding: 2 bits/symbol
• Huffman coding: variable length
• Shannon-Fano coding comparison`,
      matlabCode: `% Extended Huffman Coding with Multiple Examples
function extended_huffman_examples()
    fprintf('Extended Huffman Coding Examples\\n');
    fprintf('================================\\n\\n');
    
    % Example 1: Original problem
    example1();
    fprintf('\\n%s\\n', repmat('=', 50, 1));
    
    % Example 2: Different probability distribution
    example2();
end

function example1()
    symbols = {'x1', 'x2', 'x3', 'x4'};
    probs = [0.3, 0.2, 0.4, 0.1];
    
    fprintf('Example 1: 4-symbol source\\n');
    fprintf('--------------------------\\n');
    analyze_huffman(symbols, probs);
end

function example2()
    symbols = {'A', 'B', 'C', 'D', 'E'};
    probs = [0.4, 0.2, 0.2, 0.1, 0.1];
    
    fprintf('Example 2: 5-symbol source\\n');
    fprintf('--------------------------\\n');
    analyze_huffman(symbols, probs);
end

function analyze_huffman(symbols, probabilities)
    % Basic Huffman coding implementation
    [prob_sorted, idx] = sort(probabilities, 'descend');
    sym_sorted = symbols(idx);
    codes = cell(size(symbols));
    for i = 1:length(codes), codes{i} = ''; end
    
    % Huffman algorithm
    while length(prob_sorted) > 1
        % Update codes
        for i = 1:length(codes)
            if strcmp(sym_sorted{end}, symbols{i})
                codes{i} = ['1' codes{i}];
            elseif strcmp(sym_sorted{end-1}, symbols{i})
                codes{i} = ['0' codes{i}];
            end
        end
        
        % Combine
        new_prob = prob_sorted(end-1) + prob_sorted(end);
        new_sym = [sym_sorted{end-1} '+' sym_sorted{end}];
        prob_sorted = [prob_sorted(1:end-2), new_prob];
        sym_sorted = [sym_sorted(1:end-2), {new_sym}];
        [prob_sorted, sort_idx] = sort(prob_sorted, 'descend');
        sym_sorted = sym_sorted(sort_idx);
    end
    
    % Display results
    fprintf('Symbol\\tProbability\\tCode\\tLength\\n');
    fprintf('------\\t----------\\t----\\t------\\n');
    for i = 1:length(symbols)
        fprintf('%s\\t%.3f\\t\\t%s\\t%d\\n', ...
                symbols{i}, probabilities(i), codes{i}, length(codes{i}));
    end
    
    % Calculate metrics
    avg_len = sum(probabilities .* cellfun(@length, codes));
    entropy = -sum(probabilities .* log2(probabilities));
    efficiency = (entropy / avg_len) * 100;
    
    fprintf('\\nAverage Length: %.4f bits\\n', avg_len);
    fprintf('Entropy: %.4f bits\\n', entropy);
    fprintf('Efficiency: %.2f%%\\n', efficiency);
    fprintf('Fixed-length equivalent: %d bits\\n', ceil(log2(length(symbols))));
end

extended_huffman_examples();`
    },
    {
      id: 11,
      title: "Huffman Coding - 6 Symbol Source",
      description: "Write a MATLAB code to design Huffman Codes and Evaluate Coding efficiency.",
      example: "A zero-memory source emits six messages (x1, x2, x3, x4, x5, x6) with probabilities (0.19, 0.15, 0.2, 0.16, 0.4, 0.08) respectively.",
      requirements: [
        "Find Codewords",
        "Determine average word length", 
        "Find entropy of the source",
        "Determine efficiency and redundancy"
      ],
      theory: `SIX-SYMBOL SOURCE ANALYSIS:
• More complex Huffman tree
• Deeper code lengths
• Higher compression potential`,
      matlabCode: `% Huffman Coding for 6-Symbol Source
function huffman_6symbol()
    symbols = {'x1', 'x2', 'x3', 'x4', 'x5', 'x6'};
    probabilities = [0.19, 0.15, 0.2, 0.16, 0.4, 0.08];
    
    fprintf('Huffman Coding: 6-Symbol Source\\n');
    fprintf('===============================\\n\\n');
    
    % Verify probability sum
    total_prob = sum(probabilities);
    if abs(total_prob - 1.0) > 1e-10
        fprintf('Warning: Probabilities sum to %.6f (should be 1.0)\\n', total_prob);
        % Normalize probabilities
        probabilities = probabilities / total_prob;
    end
    
    fprintf('Symbol\\tProbability\\n');
    fprintf('------\\t----------\\n');
    for i = 1:length(symbols)
        fprintf('%s\\t%.3f\\n', symbols{i}, probabilities(i));
    end
    fprintf('Total:\\t%.6f\\n\\n', sum(probabilities));
    
    % Sort probabilities
    [prob_sorted, idx] = sort(probabilities, 'descend');
    sym_sorted = symbols(idx);
    codes = cell(size(symbols));
    for i = 1:length(codes), codes{i} = ''; end
    
    % Huffman coding with detailed steps
    step = 1;
    while length(prob_sorted) > 1
        fprintf('Step %d - Combining:\\n', step);
        fprintf('  %s (%.3f) + %s (%.3f) = %.3f\\n', ...
                sym_sorted{end-1}, prob_sorted(end-1), ...
                sym_sorted{end}, prob_sorted(end), ...
                prob_sorted(end-1) + prob_sorted(end));
        
        % Assign codes
        for i = 1:length(codes)
            if strcmp(sym_sorted{end}, symbols{i})
                codes{i} = ['1' codes{i}];
            elseif strcmp(sym_sorted{end-1}, symbols{i})
                codes{i} = ['0' codes{i}];
            end
        end
        
        % Combine and sort
        new_prob = prob_sorted(end-1) + prob_sorted(end);
        new_sym = [sym_sorted{end-1} '+' sym_sorted{end}];
        prob_sorted = [prob_sorted(1:end-2), new_prob];
        sym_sorted = [sym_sorted(1:end-2), {new_sym}];
        [prob_sorted, sort_idx] = sort(prob_sorted, 'descend');
        sym_sorted = sym_sorted(sort_idx);
        
        step = step + 1;
    end
    
    % Display final codes
    fprintf('\\nFinal Huffman Codes:\\n');
    fprintf('====================\\n');
    fprintf('Symbol\\tProbability\\tHuffman Code\\tLength\\n');
    fprintf('------\\t----------\\t------------\\t------\\n');
    
    for i = 1:length(symbols)
        fprintf('%s\\t%.3f\\t\\t%s\\t\\t%d\\n', ...
                symbols{i}, probabilities(i), codes{i}, length(codes{i}));
    end
    
    % Comprehensive analysis
    avg_length = 0;
    entropy = 0;
    
    for i = 1:length(probabilities)
        avg_length = avg_length + probabilities(i) * length(codes{i});
        if probabilities(i) > 0
            entropy = entropy - probabilities(i) * log2(probabilities(i));
        end
    end
    
    efficiency = (entropy / avg_length) * 100;
    fixed_length = ceil(log2(length(symbols))); % 3 bits for 6 symbols
    compression_ratio = fixed_length / avg_length;
    
    fprintf('\\nPerformance Analysis:\\n');
    fprintf('=====================\\n');
    fprintf('Average Code Length: %.4f bits/symbol\\n', avg_length);
    fprintf('Source Entropy: %.4f bits/symbol\\n', entropy);
    fprintf('Coding Efficiency: %.2f%%\\n', efficiency);
    fprintf('Redundancy: %.2f%%\\n', 100 - efficiency);
    fprintf('Fixed-length coding: %d bits/symbol\\n', fixed_length);
    fprintf('Compression Ratio: %.3f:1\\n', compression_ratio);
    fprintf('Bits Saved: %.1f%%\\n', (1 - avg_length/fixed_length) * 100);
    
    % Code tree visualization
    fprintf('\\nCode Tree (sorted by probability):\\n');
    fprintf('===================================\\n');
    [~, prob_order] = sort(probabilities, 'descend');
    for i = prob_order
        fprintf('  %s (p=%.3f) -> %s\\n', symbols{i}, probabilities(i), codes{i});
    end
end

% Execute the function
huffman_6symbol();`
    },
    {
      id: 12,
      title: "Entropy and Mutual Information",
      description: "Write a MATLAB code for Calculation of various Entropies and mutual information in communication system.",
      example: "Find entropy H(X), H(Y), and mutual information where channel matrix P[Y|X] = [0.8 0.2; 0.1 0.9] with P(x1)=0.6, P(x2)=0.4",
      requirements: [
        "Calculate H(X), H(Y)",
        "Calculate mutual information I(X;Y)",
        "Calculate conditional entropies"
      ],
      theory: `INFORMATION THEORY CONCEPTS:
• Entropy: Measure of uncertainty
• Mutual Information: Shared information between variables
• Channel Capacity: Maximum achievable rate

KEY FORMULAS:
• H(X) = -Σ p(x) log₂ p(x)
• I(X;Y) = H(X) - H(X|Y) = H(Y) - H(Y|X)
• Channel capacity C = max I(X;Y)`,
      matlabCode: `% Entropy and Mutual Information Calculation
function entropy_mutual_info()
    % Given probabilities
    P_X = [0.6, 0.4]; % P(x1), P(x2)
    P_Y_given_X = [0.8, 0.2;  % P(y1|x1), P(y2|x1)
                   0.1, 0.9]; % P(y1|x2), P(y2|x2)
    
    fprintf('Entropy and Mutual Information Calculation\\n');
    fprintf('==========================================\\n\\n');
    
    % Calculate joint probability P(X,Y)
    P_XY = zeros(size(P_Y_given_X));
    for i = 1:length(P_X)
        for j = 1:size(P_Y_given_X, 2)
            P_XY(i,j) = P_X(i) * P_Y_given_X(i,j);
        end
    end
    
    fprintf('Joint Probability Matrix P(X,Y):\\n');
    disp(P_XY);
    fprintf('\\n');
    
    % Calculate P(Y)
    P_Y = sum(P_XY, 1);
    fprintf('Marginal P(Y): [%.3f, %.3f]\\n\\n', P_Y(1), P_Y(2));
    
    % Calculate H(X) - Source Entropy
    H_X = 0;
    for i = 1:length(P_X)
        if P_X(i) > 0
            H_X = H_X - P_X(i) * log2(P_X(i));
        end
    end
    fprintf('H(X) = %.4f bits\\n', H_X);
    
    % Calculate H(Y) - Output Entropy
    H_Y = 0;
    for i = 1:length(P_Y)
        if P_Y(i) > 0
            H_Y = H_Y - P_Y(i) * log2(P_Y(i));
        end
    end
    fprintf('H(Y) = %.4f bits\\n', H_Y);
    
    % Calculate H(Y|X) - Conditional Entropy
    H_Y_given_X = 0;
    for i = 1:length(P_X)
        for j = 1:length(P_Y)
            if P_XY(i,j) > 0
                H_Y_given_X = H_Y_given_X - P_XY(i,j) * log2(P_Y_given_X(i,j));
            end
        end
    end
    fprintf('H(Y|X) = %.4f bits\\n', H_Y_given_X);
    
    % Calculate Mutual Information I(X;Y)
    I_XY = H_Y - H_Y_given_X;
    fprintf('I(X;Y) = H(Y) - H(Y|X) = %.4f bits\\n', I_XY);
    
    % Alternative calculation
    H_X_given_Y = H_X - I_XY;
    fprintf('H(X|Y) = H(X) - I(X;Y) = %.4f bits\\n', H_X_given_Y);
    
    % Verify symmetry
    I_XY_alt = H_X + H_Y - (-sum(P_XY(:) .* log2(P_XY(:))));
    fprintf('I(X;Y) alternative calculation = %.4f bits\\n', I_XY_alt);
    
    % Channel capacity (for this input distribution)
    fprintf('\\nChannel Analysis:\\n');
    fprintf('=================\\n');
    fprintf('Channel Matrix P(Y|X):\\n');
    disp(P_Y_given_X);
    fprintf('Mutual Information: %.4f bits\\n', I_XY);
    fprintf('This is the achievable rate for given input distribution.\\n');
end

% Run the function
entropy_mutual_info();`
    },
    {
      id: 13,
      title: "Entropy Calculation - Extended",
      description: "Write a MATLAB code for Calculation of various Entropies and mutual information in communication system.",
      example: "Find entropy H(X), H(Y), and mutual information where channel matrix P[Y|X] = [0.7 0.3; 0.2 0.8] with P(x1)=0.5, P(x2)=0.5",
      requirements: [
        "Calculate various entropies",
        "Compute mutual information",
        "Analyze channel capacity"
      ],
      theory: `EXTENDED ANALYSIS:
• Different channel matrices
• Symmetric vs asymmetric channels
• Capacity calculations`,
      matlabCode: `% Extended Entropy and Channel Analysis
function extended_entropy_analysis()
    fprintf('Extended Entropy and Channel Analysis\\n');
    fprintf('=====================================\\n\\n');
    
    % Example 1: Symmetric channel
    fprintf('Example 1: Binary Symmetric Channel\\n');
    fprintf('-----------------------------------\\n');
    P_X1 = [0.5, 0.5];
    P_Y_given_X1 = [0.8, 0.2; 0.2, 0.8];
    analyze_channel(P_X1, P_Y_given_X1, 'BSC');
    
    fprintf('\\n%s\\n', repmat('=', 50, 1));
    
    % Example 2: Asymmetric channel
    fprintf('\\nExample 2: Asymmetric Channel\\n');
    fprintf('-----------------------------\\n');
    P_X2 = [0.6, 0.4];
    P_Y_given_X2 = [0.9, 0.1; 0.3, 0.7];
    analyze_channel(P_X2, P_Y_given_X2, 'Asymmetric');
end

function analyze_channel(P_X, P_Y_given_X, channel_type)
    fprintf('Channel Type: %s\\n', channel_type);
    fprintf('P(X): [%.2f, %.2f]\\n', P_X(1), P_X(2));
    fprintf('Channel Matrix P(Y|X):\\n');
    disp(P_Y_given_X);
    
    % Calculate joint probability
    P_XY = zeros(size(P_Y_given_X));
    for i = 1:length(P_X)
        for j = 1:size(P_Y_given_X, 2)
            P_XY(i,j) = P_X(i) * P_Y_given_X(i,j);
        end
    end
    
    % Calculate P(Y)
    P_Y = sum(P_XY, 1);
    
    % Calculate entropies
    H_X = -sum(P_X .* log2(P_X));
    H_Y = -sum(P_Y .* log2(P_Y));
    
    % Calculate conditional entropy H(Y|X)
    H_Y_given_X = 0;
    for i = 1:length(P_X)
        for j = 1:length(P_Y)
            if P_XY(i,j) > 0
                H_Y_given_X = H_Y_given_X - P_XY(i,j) * log2(P_Y_given_X(i,j));
            end
        end
    end
    
    % Mutual information
    I_XY = H_Y - H_Y_given_X;
    
    fprintf('\\nResults:\\n');
    fprintf('--------\\n');
    fprintf('H(X) = %.4f bits\\n', H_X);
    fprintf('H(Y) = %.4f bits\\n', H_Y);
    fprintf('H(Y|X) = %.4f bits\\n', H_Y_given_X);
    fprintf('I(X;Y) = %.4f bits\\n', I_XY);
    fprintf('Channel Efficiency: %.2f%%\\n', (I_XY/H_X)*100);
end

extended_entropy_analysis();`
    },
    {
      id: 14,
      title: "Linear Block Codes - (6,3) Code",
      description: "Write a MATLAB code for Simulation Study of Linear Block codes.",
      example: "Obtain code words for (6,3) LBC with generator matrix G = [100101; 010011; 001110]. Find codewords for message 001.",
      requirements: [
        "Generate all codewords",
        "Find codeword for specific message",
        "Implement error detection"
      ],
      theory: `LINEAR BLOCK CODES:
• (n,k) codes: k information bits, n codeword bits
• Generator matrix G creates codewords
• Parity check matrix H for error detection
• Systematic form: [I|P] where I is identity matrix

PROPERTIES:
• Minimum distance determines error correction capability
• Syndrome decoding for error correction`,
      matlabCode: `% Linear Block Code (6,3) Implementation
function linear_block_code_63()
    % Generator Matrix for (6,3) code
    G = [1 0 0 1 0 1;
         0 1 0 0 1 1;
         0 0 1 1 1 0];
    
    k = 3; % Message length
    n = 6; % Codeword length
    
    fprintf('(6,3) Linear Block Code Analysis\\n');
    fprintf('================================\\n\\n');
    
    fprintf('Generator Matrix G:\\n');
    disp(G);
    fprintf('\\n');
    
    % All possible message vectors
    messages = dec2bin(0:2^k-1) - '0';
    
    fprintf('All Codewords:\\n');
    fprintf('==============\\n');
    codewords = mod(messages * G, 2);
    
    for i = 1:size(codewords, 1)
        fprintf('Message: %s -> Codeword: %s\\n', ...
                num2str(messages(i,:)), num2str(codewords(i,:)));
    end
    fprintf('\\n');
    
    % Specific example: message [0 0 1]
    message = [0 0 1];
    codeword = mod(message * G, 2);
    fprintf('Specific Example:\\n');
    fprintf('================\\n');
    fprintf('Message [0 0 1] -> Codeword: %s\\n', num2str(codeword));
    fprintf('\\n');
    
    % Parity check matrix (H)
    H = [1 0 1 1 0 0;
         0 1 1 0 1 0;
         1 1 0 0 0 1];
    
    fprintf('Parity Check Matrix H:\\n');
    disp(H);
    fprintf('\\n');
    
    % Verify GH^T = 0
    verification = mod(G * H', 2);
    fprintf('Verification (G * H^T should be zero):\\n');
    disp(verification);
    fprintf('\\n');
    
    % Error detection example
    received = [0 0 1 1 1 0]; % This should be correct
    syndrome = mod(received * H', 2);
    fprintf('Error Detection Example:\\n');
    fprintf('========================\\n');
    fprintf('Received vector: %s\\n', num2str(received));
    fprintf('Syndrome: %s\\n', num2str(syndrome));
    
    if sum(syndrome) == 0
        fprintf('✓ No error detected. Received codeword is valid.\\n');
    else
        fprintf('✗ Error detected. Syndrome: %s\\n', num2str(syndrome));
    end
    fprintf('\\n');
    
    % Code properties
    fprintf('Code Properties:\\n');
    fprintf('===============\\n');
    fprintf('Code rate: %d/%d = %.3f\\n', k, n, k/n);
    
    % Calculate minimum Hamming distance
    min_weight = min(sum(codewords(2:end,:), 2)); % exclude all-zero codeword
    fprintf('Minimum Hamming weight: %d\\n', min_weight);
    fprintf('Minimum Hamming distance: %d\\n', min_weight);
    fprintf('Error detection capability: %d errors\\n', min_weight - 1);
    fprintf('Error correction capability: %d errors\\n', floor((min_weight - 1)/2));
    
    % Calculate code efficiency
    efficiency = (k/n) * 100;
    fprintf('Code efficiency: %.1f%%\\n', efficiency);
end

% Run the function
linear_block_code_63();`
    },
    {
      id: 15,
      title: "Linear Block Codes - Systematic (7,4) Code",
      description: "Write a MATLAB code for Simulation Study of Linear Block codes.",
      example: "For a systematic (7,4) LBC, construct generator matrix and find code vector for message 1100.",
      requirements: [
        "Construct generator matrix from parity matrix",
        "Generate codewords",
        "Implement error correction"
      ],
      theory: `SYSTEMATIC (7,4) HAMMING CODE:
• Classic error correcting code
• Can correct single errors
• Systematic form: message bits followed by parity bits
• Widely used in computer memory systems

PARITY MATRIX TO GENERATOR MATRIX:
• G = [I|P] where P is parity matrix
• H = [P^T|I] for syndrome calculation`,
      matlabCode: `% Systematic (7,4) Linear Block Code
function systematic_74_code()
    % Given parity matrix
    P = [1 1 0;
         0 1 1;
         1 1 1;
         1 0 1];
    
    k = 4; % Message length
    n = 7; % Codeword length
    
    fprintf('Systematic (7,4) Linear Block Code\\n');
    fprintf('===================================\\n\\n');
    
    fprintf('Given Parity Matrix P:\\n');
    disp(P);
    fprintf('\\n');
    
    % Construct generator matrix G = [I|P]
    I_k = eye(k);
    G = [I_k, P];
    
    fprintf('Generator Matrix G = [I|P]:\\n');
    disp(G);
    fprintf('\\n');
    
    % Construct parity check matrix H = [P^T|I]
    I_nk = eye(n-k);
    H = [P', I_nk];
    
    fprintf('Parity Check Matrix H = [P^T|I]:\\n');
    disp(H);
    fprintf('\\n');
    
    % Verify GH^T = 0
    verification = mod(G * H', 2);
    fprintf('Verification (G * H^T):\\n');
    disp(verification);
    fprintf('All zeros? %s\\n', string(all(verification(:) == 0)));
    fprintf('\\n');
    
    % Generate all codewords
    messages = dec2bin(0:2^k-1) - '0';
    codewords = mod(messages * G, 2);
    
    fprintf('Sample Codewords:\\n');
    fprintf('=================\\n');
    for i = 1:min(8, size(codewords, 1))
        fprintf('Message: %s -> Codeword: %s\\n', ...
                num2str(messages(i,:)), num2str(codewords(i,:)));
    end
    fprintf('... (showing first 8 of %d)\\n\\n', size(codewords, 1));
    
    % Specific example: message [1 1 0 0]
    message = [1 1 0 0];
    codeword = mod(message * G, 2);
    fprintf('Specific Example - Message [1 1 0 0]:\\n');
    fprintf('=====================================\\n');
    fprintf('Codeword: %s\\n', num2str(codeword));
    fprintf('\\n');
    
    % Error correction example
    fprintf('Error Correction Example:\\n');
    fprintf('=========================\\n');
    
    % Original codeword
    original = codeword;
    fprintf('Original codeword:  %s\\n', num2str(original));
    
    % Introduce single error
    error_pos = 3;
    received = original;
    received(error_pos) = ~received(error_pos);
    fprintf('Received with error: %s (error at position %d)\\n', num2str(received), error_pos);
    
    % Calculate syndrome
    syndrome = mod(received * H', 2);
    fprintf('Syndrome: %s\\n', num2str(syndrome));
    
    % Find error pattern (simplified - for single errors)
    error_pattern = zeros(1, n);
    if sum(syndrome) > 0
        % For Hamming code, syndrome gives error position directly
        error_position = bi2de(syndrome, 'left-msb') + 1;
        error_pattern(error_position) = 1;
        fprintf('Error detected at position: %d\\n', error_position);
        
        % Correct error
        corrected = mod(received + error_pattern, 2);
        fprintf('Corrected codeword: %s\\n', num2str(corrected));
        fprintf('Correction successful? %s\\n', string(isequal(corrected, original)));
    else
        fprintf('No error detected.\\n');
    end
    fprintf('\\n');
    
    % Code analysis
    fprintf('Code Analysis:\\n');
    fprintf('==============\\n');
    fprintf('Code rate: %d/%d = %.3f\\n', k, n, k/n);
    fprintf('Minimum distance: 3 (Hamming code property)\\n');
    fprintf('Error correction: 1 error\\n');
    fprintf('Error detection: 2 errors\\n');
end

% Run the function
systematic_74_code();`
    },
    {
      id: 16,
      title: "Cyclic Codes Implementation",
      description: "Write a MATLAB code for Simulation Study of Cyclic codes.",
      example: "For cyclic code with generator polynomial g(X), obtain codewords for [1011], [1010]",
      requirements: [
        "Implement cyclic encoding",
        "Generate systematic codewords",
        "Verify cyclic property"
      ],
      theory: `CYCLIC CODES:
• Special class of linear codes
• Cyclic shift of codeword produces another codeword
• Represented using generator polynomials
• Efficient encoding and decoding using shift registers

GENERATOR POLYNOMIAL:
• g(X) = g₀ + g₁X + g₂X² + ... + gₖXᵏ
• Divides Xⁿ + 1
• Codewords are multiples of g(X)`,
      matlabCode: `% Cyclic Codes Implementation
function cyclic_codes_demo()
    % Example: (7,4) Cyclic Code
    % Generator polynomial: g(X) = X^3 + X + 1 = [1 0 1 1]
    
    g = [1 0 1 1]; % Generator polynomial coefficients
    n = 7; % Codeword length
    k = 4; % Message length
    
    fprintf('Cyclic Code (7,4) Implementation\\n');
    fprintf('================================\\n\\n');
    
    fprintf('Generator polynomial: g(X) = ');
    print_polynomial(g);
    fprintf('\\n\\n');
    
    % Test messages
    messages = [1 0 1 1;  % [1011]
                1 0 1 0]; % [1010]
    
    for msg_idx = 1:size(messages, 1)
        message = messages(msg_idx, :);
        fprintf('Encoding message: %s\\n', num2str(message));
        
        % Method 1: Systematic encoding using polynomial division
        % Multiply message by X^(n-k)
        message_padded = [message, zeros(1, n-k)];
        
        % Polynomial division to find remainder
        [~, remainder] = deconv(message_padded, g);
        remainder = mod(remainder, 2);
        
        % Take only the remainder part (last n-k bits)
        if length(remainder) < n-k
            remainder = [zeros(1, n-k-length(remainder)), remainder];
        else
            remainder = remainder(end-n-k+1:end);
        end
        
        % Systematic codeword: message + remainder
        codeword = [message, remainder(1:n-k)];
        fprintf('Systematic codeword: %s\\n', num2str(codeword));
        
        % Verify the codeword is valid (should be divisible by g(X))
        [~, rem_verify] = deconv(codeword, g);
        rem_verify = mod(rem_verify, 2);
        
        if all(rem_verify == 0)
            fprintf('✓ Codeword is valid (divisible by g(X))\\n');
        else
            fprintf('✗ Codeword is invalid\\n');
        end
        
        % Demonstrate cyclic shift property
        shifted = circshift(codeword, -1);
        fprintf('Left cyclic shift: %s\\n', num2str(shifted));
        
        % Check if shifted codeword is also valid
        [~, rem_shift] = deconv(shifted, g);
        rem_shift = mod(rem_shift, 2);
        
        if all(rem_shift == 0)
            fprintf('✓ Shifted codeword is also valid\\n');
        else
            fprintf('✗ Shifted codeword is invalid\\n');
        end
        fprintf('\\n');
    end
    
    % Generate all codewords
    fprintf('All Codewords for (7,4) Cyclic Code:\\n');
    fprintf('====================================\\n');
    all_messages = dec2bin(0:2^k-1) - '0';
    for i = 1:size(all_messages, 1)
        msg = all_messages(i, :);
        msg_padded = [msg, zeros(1, n-k)];
        [~, rem] = deconv(msg_padded, g);
        rem = mod(rem, 2);
        if length(rem) < n-k
            rem = [zeros(1, n-k-length(rem)), rem];
        else
            rem = rem(end-n-k+1:end);
        end
        cw = [msg, rem(1:n-k)];
        fprintf('Message %s -> Codeword %s\\n', num2str(msg), num2str(cw));
    end
end

function print_polynomial(coeffs)
    % Helper function to print polynomial
    terms = {};
    for i = 1:length(coeffs)
        if coeffs(i) == 1
            if i == 1
                terms{end+1} = '1';
            else
                terms{end+1} = ['X^' num2str(i-1)];
            end
        end
    end
    fprintf('%s', strjoin(terms, ' + '));
end

% Run the function
cyclic_codes_demo();`
    },
    {
      id: 17,
      title: "Cyclic Codes - Extended Examples",
      description: "Write a MATLAB code for Simulation Study of Cyclic codes.",
      example: "For cyclic code with generator polynomial g(X), obtain codewords for [1100],[1000]",
      requirements: [
        "Implement different generator polynomials",
        "Compare code performance",
        "Analyze error detection capability"
      ],
      theory: `EXTENDED CYCLIC CODES:
• Different generator polynomials for same (n,k)
• CRC codes as cyclic codes
• Error detection capabilities
• Implementation using shift registers

COMMON GENERATOR POLYNOMIALS:
• CRC-16: X¹⁶ + X¹⁵ + X² + 1
• CRC-32: X³² + X²⁶ + X²³ + X²² + X¹⁶ + X¹² + X¹¹ + X¹⁰ + X⁸ + X⁷ + X⁵ + X⁴ + X² + X + 1`,
      matlabCode: `% Extended Cyclic Codes with Different Polynomials
function extended_cyclic_codes()
    fprintf('Extended Cyclic Codes Analysis\\n');
    fprintf('==============================\\n\\n');
    
    % Example 1: (7,4) Hamming code as cyclic code
    fprintf('Example 1: (7,4) Cyclic Hamming Code\\n');
    fprintf('------------------------------------\\n');
    g1 = [1 0 1 1]; % g(X) = X^3 + X + 1
    analyze_cyclic_code(g1, 7, 4, 'Hamming Code');
    
    fprintf('\\n%s\\n', repmat('=', 50, 1));
    
    % Example 2: Different generator polynomial
    fprintf('\\nExample 2: Alternative (7,4) Cyclic Code\\n');
    fprintf('-----------------------------------------\\n');
    g2 = [1 1 0 1]; % g(X) = X^3 + X^2 + 1
    analyze_cyclic_code(g2, 7, 4, 'Alternative Code');
end

function analyze_cyclic_code(g, n, k, code_name)
    fprintf('Code: %s\\n', code_name);
    fprintf('Generator polynomial: ');
    print_poly(g);
    fprintf('\\n');
    
    % Test messages
    test_messages = [1 1 0 0;  % [1100]
                     1 0 0 0]; % [1000]
    
    fprintf('Test Messages Encoding:\\n');
    fprintf('-----------------------\\n');
    
    for i = 1:size(test_messages, 1)
        message = test_messages(i, :);
        
        % Systematic encoding
        message_padded = [message, zeros(1, n-k)];
        [~, remainder] = deconv(message_padded, g);
        remainder = mod(remainder, 2);
        
        if length(remainder) < n-k
            remainder = [zeros(1, n-k-length(remainder)), remainder];
        else
            remainder = remainder(end-n-k+1:end);
        end
        
        codeword = [message, remainder(1:n-k)];
        fprintf('Message %s -> Codeword %s\\n', num2str(message), num2str(codeword));
        
        % Verify cyclic property
        for shift = 1:2
            shifted = circshift(codeword, -shift);
            [~, rem_check] = deconv(shifted, g);
            rem_check = mod(rem_check, 2);
            if all(rem_check == 0)
                fprintf('  Shift %d: Valid cyclic codeword\\n', shift);
            else
                fprintf('  Shift %d: Invalid (not cyclic)\\n', shift);
            end
        end
    end
    
    % Error detection capability
    fprintf('\\nError Detection Analysis:\\n');
    fprintf('--------------------------\\n');
    
    % Generate a valid codeword
    message = [1 0 1 0];
    message_padded = [message, zeros(1, n-k)];
    [~, remainder] = deconv(message_padded, g);
    remainder = mod(remainder, 2);
    if length(remainder) < n-k
        remainder = [zeros(1, n-k-length(remainder)), remainder];
    else
        remainder = remainder(end-n-k+1:end);
    end
    valid_codeword = [message, remainder(1:n-k)];
    
    fprintf('Valid codeword: %s\\n', num2str(valid_codeword));
    
    % Test error patterns
    error_patterns = [
        1 0 0 0 0 0 0;  % Single error
        1 1 0 0 0 0 0;  % Double adjacent errors
        1 0 0 1 0 0 0   % Two separate errors
    ];
    
    for i = 1:size(error_patterns, 1)
        error_pattern = error_patterns(i, :);
        corrupted = mod(valid_codeword + error_pattern, 2);
        [~, syndrome] = deconv(corrupted, g);
        syndrome = mod(syndrome, 2);
        
        if any(syndrome)
            fprintf('Error pattern %d: DETECTED (syndrome non-zero)\\n', i);
        else
            fprintf('Error pattern %d: UNDETECTED (syndrome zero)\\n', i);
        end
    end
end

function print_poly(coeffs)
    terms = {};
    for i = 1:length(coeffs)
        if coeffs(i) == 1
            if i == 1
                terms{end+1} = '1';
            elseif i == 2
                terms{end+1} = 'X';
            else
                terms{end+1} = ['X^' num2str(i-1)];
            end
        end
    end
    if isempty(terms)
        fprintf('0');
    else
        fprintf('%s', strjoin(terms, ' + '));
    end
end

% Run the function
extended_cyclic_codes();`
    }
  ];

  // Navigation items with proper TypeScript typing
  const navigationItems: { id: string; label: string; color: string }[] = [
    { id: "practicals", label: "🔬 All 17 Practicals", color: "blue" },
    { id: "matlab", label: "💻 MATLAB Programs", color: "green" },
    { id: "theory", label: "📚 Theory Questions", color: "purple" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            📡 Complete Communication Systems Laboratory
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            All 17 Practical Experiments with Complete MATLAB Code and Theory
          </p>
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

        {/* Practical Experiments Section */}
        {activeSection === "practicals" && (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-4xl font-bold text-blue-700 mb-8 text-center">
              🔬 All 17 Practical Experiments
            </h2>
            <div className="space-y-8">
              {practicalExperiments.map((exp) => (
                <div key={exp.id} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
                  <h3 className="text-2xl font-bold text-blue-800 mb-4">
                    Practical {exp.id}: {exp.title}
                  </h3>
                  <p className="text-gray-700 mb-4">{exp.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-blue-700 mb-2">Requirements:</h4>
                    <ul className="list-disc ml-6 text-gray-600">
                      {exp.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  {exp.example && (
                    <div className="mb-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-700 mb-2">Example:</h4>
                      <p className="text-yellow-800">{exp.example}</p>
                    </div>
                  )}
                  
                  <div className="mb-4 bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-700 mb-2">Theory & Implementation:</h4>
                    <p className="text-green-800 whitespace-pre-line">{exp.theory}</p>
                  </div>

                  {exp.matlabCode && (
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-gray-700">MATLAB Code:</h4>
                        <button
                          onClick={() => copyToClipboard(exp.matlabCode!)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          📋 Copy Code
                        </button>
                      </div>
                      <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                        <pre className="text-green-400 text-sm leading-relaxed">
                          <code>{exp.matlabCode}</code>
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MATLAB Programs Section */}
        {activeSection === "matlab" && (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-4xl font-bold text-green-700 mb-8 text-center">
              💻 MATLAB Programs (7-17)
            </h2>
            <div className="space-y-8">
              {practicalExperiments.filter(exp => exp.matlabCode).map((exp) => (
                <div key={exp.id} className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <h3 className="text-2xl font-bold text-green-800 mb-2 lg:mb-0">
                      Program {exp.id}: {exp.title}
                    </h3>
                    <button
                      onClick={() => copyToClipboard(exp.matlabCode!)}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-semibold transition-colors"
                    >
                      📋 Copy MATLAB Code
                    </button>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{exp.description}</p>
                  
                  {exp.example && (
                    <div className="mb-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-700 mb-2">Example:</h4>
                      <p className="text-yellow-800">{exp.example}</p>
                    </div>
                  )}
                  
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
                      <code>{exp.matlabCode}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Theory Questions Section */}
        {activeSection === "theory" && (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-4xl font-bold text-purple-700 mb-8 text-center">
              📚 Communication Systems Theory
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* BPSK Theory */}
              <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-4">📡 BPSK</h3>
                <ul className="space-y-2 text-blue-700">
                  <li><strong>Full Form:</strong> Binary Phase Shift Keying</li>
                  <li><strong>Phases:</strong> 2 distinct phases (0° and 180°)</li>
                  <li><strong>Bits/Symbol:</strong> 1 bit per symbol</li>
                  <li><strong>BER:</strong> 0.5 × erfc(√SNR)</li>
                  <li><strong>Application:</strong> Satellite communication, wireless networks</li>
                </ul>
              </div>

              {/* QPSK Theory */}
              <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                <h3 className="text-xl font-bold text-green-800 mb-4">🔄 QPSK</h3>
                <ul className="space-y-2 text-green-700">
                  <li><strong>Full Form:</strong> Quadrature Phase Shift Keying</li>
                  <li><strong>Phases:</strong> 4 phases (45°, 135°, 225°, 315°)</li>
                  <li><strong>Bits/Symbol:</strong> 2 bits per symbol</li>
                  <li><strong>Advantage:</strong> Double bandwidth efficiency vs BPSK</li>
                  <li><strong>Application:</strong> Digital video broadcasting, Wi-Fi</li>
                </ul>
              </div>

              {/* FSK Theory */}
              <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
                <h3 className="text-xl font-bold text-purple-800 mb-4">📊 FSK</h3>
                <ul className="space-y-2 text-purple-700">
                  <li><strong>Full Form:</strong> Frequency Shift Keying</li>
                  <li><strong>Principle:</strong> Different frequencies for 0 and 1</li>
                  <li><strong>Types:</strong> Binary FSK, M-ary FSK</li>
                  <li><strong>Advantage:</strong> Constant envelope, noise immunity</li>
                  <li><strong>Application:</strong> Modems, RFID systems</li>
                </ul>
              </div>

              {/* DSSS Theory */}
              <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
                <h3 className="text-xl font-bold text-red-800 mb-4">🛡️ DSSS</h3>
                <ul className="space-y-2 text-red-700">
                  <li><strong>Full Form:</strong> Direct Sequence Spread Spectrum</li>
                  <li><strong>Principle:</strong> Spread signal using PN code</li>
                  <li><strong>Processing Gain:</strong> Chip rate / Data rate</li>
                  <li><strong>Advantages:</strong> Security, interference rejection</li>
                  <li><strong>Application:</strong> GPS, CDMA, Wi-Fi</li>
                </ul>
              </div>

              {/* Huffman Coding Theory */}
              <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200">
                <h3 className="text-xl font-bold text-yellow-800 mb-4">📦 Huffman Coding</h3>
                <ul className="space-y-2 text-yellow-700">
                  <li><strong>Type:</strong> Lossless data compression</li>
                  <li><strong>Principle:</strong> Variable-length prefix coding</li>
                  <li><strong>Optimality:</strong> Minimum redundancy code</li>
                  <li><strong>Efficiency:</strong> η = (H/L) × 100%</li>
                  <li><strong>Application:</strong> File compression, multimedia</li>
                </ul>
              </div>

              {/* Error Control Coding Theory */}
              <div className="bg-indigo-50 rounded-xl p-6 border-2 border-indigo-200">
                <h3 className="text-xl font-bold text-indigo-800 mb-4">🔒 Error Control</h3>
                <ul className="space-y-2 text-indigo-700">
                  <li><strong>Linear Codes:</strong> (n,k) systematic codes</li>
                  <li><strong>Cyclic Codes:</strong> Special class with shift property</li>
                  <li><strong>Hamming Distance:</strong> Minimum distance between codewords</li>
                  <li><strong>Applications:</strong> Data storage, wireless communication</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-gray-600 mt-12 pt-8 border-t border-gray-300">
          <p className="text-lg font-semibold">© 2025 Communication Systems Laboratory - Practicals</p>
          <p className="text-sm mt-2">Develop By MR </p>
        </footer>
      </div>
    </div>
  );
};

export default CommunicationSystemsComplete;