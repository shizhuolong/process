package org.apdplat.module.security.service;

/**
 *在Linux平台上生成机器码
 * @author sun
 */
public class LinuxSequenceService  extends AbstractSequenceService{
    @Override
    public String getSequence() {
        return getSigarSequence("linux");
    }

    public static void main(String[] args) {
        LinuxSequenceService s = new LinuxSequenceService();
        String seq = s.getSequence();
        System.out.println(seq);
    }
}